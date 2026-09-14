const encoder = new TextEncoder()
const decoder = new TextDecoder()

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export async function encryptSecret(plaintext: string): Promise<{ ciphertext: string; iv: string; key: string }> {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plaintext))
  const rawKey = await crypto.subtle.exportKey('raw', key)
  return {
    ciphertext: toBase64Url(new Uint8Array(ciphertext)),
    iv: toBase64Url(iv),
    key: toBase64Url(new Uint8Array(rawKey)),
  }
}

export async function decryptSecret(payload: { ciphertext: string; iv: string }, encodedKey: string): Promise<string> {
  try {
    const key = await crypto.subtle.importKey('raw', fromBase64Url(encodedKey), 'AES-GCM', false, ['decrypt'])
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64Url(payload.iv) },
      key,
      fromBase64Url(payload.ciphertext),
    )
    return decoder.decode(plaintext)
  } catch {
    throw new Error('Unable to decrypt this message')
  }
}
