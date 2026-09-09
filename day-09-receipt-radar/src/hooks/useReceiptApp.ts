import { useMemo, useRef, useState } from 'react'
import { extractReceipt } from '../api'
import { demoReceipt } from '../data/demoReceipt'
import { clone } from '../lib/formatting'
import { loadReceipts, saveReceipts } from '../lib/storage'
import { verify } from '../lib/verification'
import type { Receipt, Stage } from '../types/receipt'

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Unable to read that image'))
    reader.readAsDataURL(file)
  })
}

export function useReceiptApp() {
  const [stage, setStage] = useState<Stage>('idle')
  const [receipt, setReceipt] = useState(() => clone(demoReceipt))
  const [tab, setTab] = useState<'original' | 'extracted'>('extracted')
  const [json, setJson] = useState(false)
  const [processing, setProcessing] = useState(0)
  const [error, setError] = useState<string>()
  const [saved, setSaved] = useState(loadReceipts)
  const [image, setImage] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null!)
  const flags = useMemo(() => verify(receipt), [receipt])
  const confidence = Math.max(61, 96 - flags.length * 5)

  const update = (key: keyof Receipt, value: string) => {
    setReceipt((current) => ({
      ...current,
      [key]: ['tax', 'total', 'subtotal'].includes(key)
        ? Number(value.replace(/[^\d]/g, ''))
        : value,
    }))
  }

  const scan = async (file?: File) => {
    setError(undefined)
    setStage('scanning')
    setProcessing(1)

    try {
      const scannedImage = file ? await readImage(file) : undefined
      setImage(scannedImage)
      setProcessing(2)

      const extractedReceipt = await extractReceipt(scannedImage)
      setReceipt(clone(extractedReceipt || demoReceipt))
      setProcessing(4)
      setStage('review')
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this receipt')
    }
  }

  const save = () => {
    const next = [{ ...clone(receipt), image }, ...saved]
    setSaved(next)
    saveReceipts(next)
    setStage('history')
  }

  const reset = () => {
    setReceipt(clone(demoReceipt))
    setImage(undefined)
    setError(undefined)
  }

  const openReceipt = (item: Receipt) => {
    setReceipt(clone(item))
    setImage(item.image)
    setStage('review')
  }

  return {
    stage,
    setStage,
    receipt,
    tab,
    setTab,
    json,
    setJson,
    processing,
    error,
    saved,
    image,
    inputRef,
    flags,
    confidence,
    update,
    scan,
    save,
    reset,
    openReceipt,
  }
}
