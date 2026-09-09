type ReceiptItem = {
  id: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  total: number
  confidence: number
}

type Receipt = {
  merchant: string
  date: string
  currency: string
  subtotal: number
  tax: number
  fees: number
  total: number
  payment: string
  items: ReceiptItem[]
  image?: string
}

type RequestLike = { method?: string; body?: unknown }
type ResponseLike = { status: (code: number) => ResponseLike; json: (body: unknown) => void }

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'qwen/qwen3.6-27b'

function isReceipt(value: unknown): value is Receipt {
  if (!value || typeof value !== 'object') return false

  const receipt = value as Partial<Receipt>
  return (
    typeof receipt.merchant === 'string' &&
    typeof receipt.date === 'string' &&
    typeof receipt.currency === 'string' &&
    typeof receipt.subtotal === 'number' &&
    typeof receipt.tax === 'number' &&
    typeof receipt.fees === 'number' &&
    typeof receipt.total === 'number' &&
    typeof receipt.payment === 'string' &&
    Array.isArray(receipt.items) &&
    receipt.items.every((item) => (
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.category === 'string' &&
      typeof item.quantity === 'number' &&
      typeof item.unitPrice === 'number' &&
      typeof item.total === 'number' &&
      typeof item.confidence === 'number'
    ))
  )
}

function parseBody(body: unknown): { image?: string } | null {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as { image?: string }
    } catch {
      return null
    }
  }

  return body && typeof body === 'object' ? body as { image?: string } : null
}

export default async function handler(request: RequestLike, response: ResponseLike) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return response.status(500).json({ error: 'GROQ_API_KEY is not configured' })
  }

  const body = parseBody(request.body)
  if (!body?.image || !body.image.startsWith('data:image/')) {
    return response.status(400).json({ error: 'A receipt image is required' })
  }

  try {
    const groqResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Extract receipt data exactly as printed. Never invent missing values. Use 0 for missing numeric fees or tax. Return only valid JSON matching the requested schema.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  merchant: 'string',
                  date: 'string',
                  currency: 'string',
                  subtotal: 0,
                  tax: 0,
                  fees: 0,
                  total: 0,
                  payment: 'string',
                  items: [{
                    id: 'stable-slug',
                    name: 'string',
                    category: 'string',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                    confidence: 0,
                  }],
                }),
              },
              { type: 'image_url', image_url: { url: body.image } },
            ],
          },
        ],
      }),
    })

    if (!groqResponse.ok) {
      return response.status(502).json({ error: 'Groq receipt extraction failed' })
    }

    const result = await groqResponse.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = result.choices?.[0]?.message?.content
    const receipt = content ? JSON.parse(content) as unknown : null

    if (!isReceipt(receipt)) {
      return response.status(502).json({ error: 'Groq returned an invalid receipt' })
    }

    return response.status(200).json({ ...receipt, image: body.image })
  } catch {
    return response.status(502).json({ error: 'Unable to scan this receipt' })
  }
}
