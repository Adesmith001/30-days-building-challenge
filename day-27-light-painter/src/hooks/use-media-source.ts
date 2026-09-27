import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

type SourceKind =
  | 'camera'
  | 'video'

interface TorchCapabilities
  extends MediaTrackCapabilities {
  torch?: boolean
}

interface TorchConstraint
  extends MediaTrackConstraintSet {
  torch?: boolean
}

function cameraErrorMessage(
  error: unknown,
) {
  if (!window.isSecureContext) {
    return 'Camera access requires HTTPS or localhost.'
  }

  if (
    error instanceof DOMException &&
    error.name === 'NotAllowedError'
  ) {
    return 'Camera permission was denied.'
  }

  if (
    error instanceof DOMException &&
    error.name === 'NotFoundError'
  ) {
    return 'No camera was found.'
  }

  if (
    error instanceof DOMException &&
    error.name === 'NotReadableError'
  ) {
    return 'The camera is already in use or unavailable.'
  }

  return 'Camera access was not available.'
}

export function useMediaSource() {
  const videoRef =
    useRef<HTMLVideoElement>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const objectUrlRef =
    useRef<string | null>(null)

  const [devices, setDevices] = useState<
    MediaDeviceInfo[]
  >([])

  const [sourceKind, setSourceKind] =
    useState<SourceKind>('camera')

  const [
    selectedDeviceId,
    setSelectedDeviceId,
  ] = useState('')

  const [error, setError] = useState('')

  const [
    sourceVersion,
    setSourceVersion,
  ] = useState(0)

  const [
    torchSupported,
    setTorchSupported,
  ] = useState(false)

  const [torchOn, setTorchOn] =
    useState(false)

  const stopStream = useCallback(() => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => {
        track.stop()
      })

    streamRef.current = null
    setTorchSupported(false)
    setTorchOn(false)
  }, [])

  const refreshDevices =
    useCallback(async () => {
      if (!navigator.mediaDevices) return

      const found =
        await navigator.mediaDevices.enumerateDevices()

      setDevices(
        found.filter(
          (device) =>
            device.kind === 'videoinput',
        ),
      )
    }, [])

  const openCamera = useCallback(
    async (deviceId?: string) => {
      setError('')

      try {
        if (
          !navigator.mediaDevices
            ?.getUserMedia
        ) {
          throw new Error(
            'Camera API unsupported.',
          )
        }

        stopStream()

        if (objectUrlRef.current) {
          URL.revokeObjectURL(
            objectUrlRef.current,
          )

          objectUrlRef.current = null
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: false,
              video: {
                width: {
                  ideal: 1280,
                },
                height: {
                  ideal: 720,
                },
                frameRate: {
                  ideal: 30,
                },
                ...(deviceId
                  ? {
                      deviceId: {
                        exact: deviceId,
                      },
                    }
                  : {
                      facingMode: {
                        ideal:
                          'environment',
                      },
                    }),
              },
            },
          )

        streamRef.current = stream

        const video = videoRef.current

        if (!video) {
          throw new Error(
            'Video element unavailable.',
          )
        }

        video.src = ''
        video.srcObject = stream
        video.muted = true
        video.playsInline = true

        await video.play()

        const track =
          stream.getVideoTracks()[0]

        setSelectedDeviceId(
          track.getSettings().deviceId ||
            '',
        )

        const capabilities =
          track.getCapabilities() as TorchCapabilities

        setTorchSupported(
          Boolean(capabilities.torch),
        )

        setSourceKind('camera')
        setSourceVersion(
          (value) => value + 1,
        )

        await refreshDevices()

        return true
      } catch (caught) {
        setError(
          cameraErrorMessage(caught),
        )

        return false
      }
    },
    [
      refreshDevices,
      stopStream,
    ],
  )

  const openFile = useCallback(
    async (file: File) => {
      setError('')
      stopStream()

      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current,
        )
      }

      const url =
        URL.createObjectURL(file)

      objectUrlRef.current = url

      const video = videoRef.current

      if (!video) return false

      video.srcObject = null
      video.src = url
      video.loop = true
      video.muted = true
      video.playsInline = true

      await video.play()

      setSourceKind('video')
      setSourceVersion(
        (value) => value + 1,
      )

      return true
    },
    [stopStream],
  )

  const toggleTorch =
    useCallback(async () => {
      const track =
        streamRef.current
          ?.getVideoTracks()[0]

      if (!track || !torchSupported) {
        return
      }

      const next = !torchOn

      await track.applyConstraints({
        advanced: [
          {
            torch: next,
          } as TorchConstraint,
        ],
      })

      setTorchOn(next)
    }, [
      torchOn,
      torchSupported,
    ])

  useEffect(() => {
    return () => {
      stopStream()

      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current,
        )
      }
    }
  }, [stopStream])

  return {
    videoRef,
    devices,
    selectedDeviceId,
    sourceKind,
    sourceVersion,
    error,
    torchSupported,
    torchOn,
    openCamera,
    openFile,
    toggleTorch,
    refreshDevices,
  }
}

export type MediaSourceController =
  ReturnType<typeof useMediaSource>