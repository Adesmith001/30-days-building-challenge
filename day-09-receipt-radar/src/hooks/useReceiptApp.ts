import { useMemo, useRef, useState } from 'react'
import { extractReceipt, validateReceiptFile } from '../api'
import { demoReceipt } from '../data/demoReceipt'
import { clone } from '../lib/formatting'
import { addReceiptItem, removeReceiptItem, updateReceiptItem } from '../lib/receipt'
import type { EditableItemField } from '../lib/receipt'
import { loadReceipts, saveReceipts } from '../lib/storage'
import { verify } from '../lib/verification'
import type { Receipt, ReceiptSource, Stage } from '../types/receipt'

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
  const [receipt, setReceipt] = useState<Receipt>()
  const [original, setOriginal] = useState<Receipt>()
  const [source, setSource] = useState<ReceiptSource>()
  const [fileName, setFileName] = useState('')
  const [tab, setTab] = useState<'original' | 'extracted'>('extracted')
  const [json, setJson] = useState(false)
  const [processing, setProcessing] = useState(0)
  const [error, setError] = useState<string>()
  const [saved, setSaved] = useState(loadReceipts)
  const [image, setImage] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null!)
  const flags = useMemo(() => receipt ? verify(receipt) : [], [receipt])
  const confidence = receipt ? Math.max(61, 96 - flags.length * 5) : 0

  const update = (key: keyof Receipt, value: string) => {
    setReceipt((current) => current ? ({
      ...current,
      [key]: ['tax', 'total', 'subtotal', 'fees'].includes(key)
        ? Number(value.replace(/,/g, '')) || 0
        : value,
    }) : current)
  }

  const updateItem = (id: string, key: EditableItemField, value: string) => {
    setReceipt((current) => current ? updateReceiptItem(current, id, key, value) : current)
  }

  const addItem = () => setReceipt((current) => current ? addReceiptItem(current) : current)
  const removeItem = (id: string) => setReceipt((current) => current ? removeReceiptItem(current, id) : current)

  const startDemo = () => {
    const next = clone(demoReceipt)
    setReceipt(next)
    setOriginal(clone(next))
    setSource('demo')
    setFileName('DEMO RECEIPT')
    setImage(undefined)
    setError(undefined)
    setTab('extracted')
    setStage('review')
  }

  const scan = async (file?: File) => {
    if (!file) return

    const validationError = validateReceiptFile(file)
    setError(undefined)
    setStage('scanning')
    setProcessing(1)

    if (validationError) {
      setError(validationError)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    try {
      const scannedImage = await readImage(file)
      setImage(scannedImage)
      setFileName(file.name)
      setSource('upload')
      setProcessing(2)

      const extractedReceipt = await extractReceipt(scannedImage)
      const next = clone(extractedReceipt)
      delete next.image
      setReceipt(next)
      setOriginal(clone(next))
      setTab('extracted')
      setProcessing(4)
      setStage('review')
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this receipt')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const save = () => {
    if (!receipt || source === 'demo') return
    const next = [{ ...clone(receipt), image }, ...saved]
    setSaved(next)
    saveReceipts(next)
    setStage('history')
  }

  const reset = () => {
    if (original) setReceipt(clone(original))
  }

  const newReceipt = () => {
    setReceipt(undefined)
    setOriginal(undefined)
    setSource(undefined)
    setFileName('')
    setImage(undefined)
    setError(undefined)
    if (inputRef.current) inputRef.current.value = ''
    setStage('idle')
  }

  const openReceipt = (item: Receipt) => {
    const next = clone(item)
    delete next.image
    setReceipt(next)
    setOriginal(clone(next))
    setImage(item.image)
    setSource('saved')
    setFileName('SAVED RECEIPT')
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
    source,
    fileName,
    inputRef,
    flags,
    confidence,
    update,
    updateItem,
    addItem,
    removeItem,
    startDemo,
    scan,
    save,
    reset,
    newReceipt,
    openReceipt,
  }
}
