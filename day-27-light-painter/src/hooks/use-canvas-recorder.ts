import {
  type RefObject,
  useCallback,
  useRef,
  useState,
} from 'react'

function getMimeType() {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]

  return (
    candidates.find((type) =>
      MediaRecorder.isTypeSupported(
        type,
      ),
    ) || ''
  )
}

export function useCanvasRecorder(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const recorderRef =
    useRef<MediaRecorder | null>(null)

  const startedAtRef = useRef(0)
  const timerRef =
    useRef<number | null>(null)

  const chunksRef =
    useRef<Blob[]>([])

  const [recording, setRecording] =
    useState(false)

  const [duration, setDuration] =
    useState(0)

  const [blob, setBlob] =
    useState<Blob | null>(null)

  const start = useCallback(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    setBlob(null)
    setDuration(0)

    const stream =
      canvas.captureStream(30)

    const mimeType = getMimeType()

    const recorder = new MediaRecorder(
      stream,
      mimeType
        ? {
            mimeType,
          }
        : undefined,
    )

    chunksRef.current = []
    startedAtRef.current =
      performance.now()

    recorder.ondataavailable = (
      event,
    ) => {
      if (event.data.size > 0) {
        chunksRef.current.push(
          event.data,
        )
      }
    }

    recorder.onstop = () => {
      const elapsed =
        performance.now() -
        startedAtRef.current

      setDuration(elapsed)

      setBlob(
        new Blob(chunksRef.current, {
          type:
            recorder.mimeType ||
            'video/webm',
        }),
      )

      stream
        .getTracks()
        .forEach((track) => {
          track.stop()
        })
    }

    recorder.start(250)
    recorderRef.current = recorder

    setRecording(true)

    timerRef.current =
      window.setInterval(() => {
        setDuration(
          performance.now() -
            startedAtRef.current,
        )
      }, 200)
  }, [canvasRef])

  const stop = useCallback(() => {
    if (
      recorderRef.current?.state ===
      'recording'
    ) {
      recorderRef.current.stop()
    }

    if (timerRef.current) {
      window.clearInterval(
        timerRef.current,
      )
    }

    timerRef.current = null
    setRecording(false)
  }, [])

  const discard = useCallback(() => {
    setBlob(null)
    setDuration(0)
  }, [])

  return {
    recording,
    duration,
    blob,
    start,
    stop,
    discard,
  }
}