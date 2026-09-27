/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/refs */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
  MediaSourceController,
} from '../../hooks/use-media-source'

import {
  useCanvasRecorder,
} from '../../hooks/use-canvas-recorder'

import {
  useLightPainter,
} from '../../hooks/use-light-painter'

import {
  useKeyboard,
} from '../../hooks/use-keyboard'

import {
  exportCanvas,
} from '../../lib/export'

import type {
  PainterMode,
  SettingsTab,
} from '../../types/painter'

import { CapturePanel } from './CapturePanel'
import { ControlBar } from './ControlBar'
import { EnginePanel } from './EnginePanel'
import { FirstRunOverlay } from './FirstRunOverlay'
import { GalleryPanel } from './GalleryPanel'
import { InfoPanel } from './InfoPanel'
import { RecordingPanel } from './RecordingPanel'
import { SettingsPanel } from './SettingsPanel'
import { TopBar } from './TopBar'

interface Props {
  media: MediaSourceController
}

type Panel =
  | null
  | 'settings'
  | 'engine'
  | 'about'
  | 'privacy'
  | 'gallery'

export function Studio({
  media,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null)

  const painter =
    useLightPainter(
      media.videoRef,
      canvasRef,
      media.sourceVersion,
    )

  const recorder =
    useCanvasRecorder(canvasRef)

  const [
    settingsTab,
    setSettingsTab,
  ] = useState<SettingsTab>('mode')

  const [panel, setPanel] =
    useState<Panel>(null)

  const [
    firstRun,
    setFirstRun,
  ] = useState<
    'intro' | 'calibrating' | 'ready' | null
  >('intro')

  const [focus, setFocus] =
    useState(false)

  const [
    controlsVisible,
    setControlsVisible,
  ] = useState(true)

  const [captureBlob, setCaptureBlob] =
    useState<Blob | null>(null)

  const wasPainting =
    useRef(false)

  const [exposureMs, setExposureMs] =
    useState(0)

  const exposureBase =
    useRef(0)

  const exposureStarted =
    useRef<number | null>(null)

  useEffect(() => {
    if (painter.painting) {
      exposureStarted.current =
        performance.now()

      const interval =
        window.setInterval(() => {
          if (
            exposureStarted.current ===
            null
          ) {
            return
          }

          setExposureMs(
            exposureBase.current +
              performance.now() -
              exposureStarted.current,
          )
        }, 100)

      return () => {
        window.clearInterval(
          interval,
        )

        if (
          exposureStarted.current !==
          null
        ) {
          exposureBase.current +=
            performance.now() -
            exposureStarted.current

          exposureStarted.current =
            null
        }
      }
    }
  }, [painter.painting])

  useEffect(() => {
    if (
      !painter.painting ||
      panel ||
      firstRun ||
      focus
    ) {
      setControlsVisible(true)
      return
    }

    const timer =
      window.setTimeout(() => {
        setControlsVisible(false)
      }, 3400)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    focus,
    firstRun,
    painter.painting,
    panel,
  ])

  const showControls = () => {
    setControlsVisible(true)
  }

  const startFirstRun =
    async () => {
      setFirstRun(
        'calibrating',
      )

      await painter.calibrate()

      setFirstRun('ready')

      window.setTimeout(() => {
        setFirstRun(null)
        painter.setPainting(true)
      }, 650)
    }

  const clear = () => {
    painter.clear()

    exposureBase.current = 0
    exposureStarted.current =
      painter.painting
        ? performance.now()
        : null

    setExposureMs(0)
  }

  const capture = async () => {
    const canvas =
      canvasRef.current

    if (!canvas) return

    wasPainting.current =
      painter.painting

    painter.setPainting(false)

    const blob =
      await exportCanvas(
        canvas,
        'original',
      )

    setCaptureBlob(blob)
  }

  const closeCapture = () => {
    setCaptureBlob(null)

    if (wasPainting.current) {
      painter.setPainting(true)
    }
  }

  const cycleMode = () => {
    const modes: PainterMode[] = [
      'light',
      'ghost',
      'color',
      'neon',
    ]

    const index =
      modes.indexOf(
        painter.settings.mode,
      )

    painter.patch({
      mode:
        modes[
          (index + 1) %
            modes.length
        ],
    })
  }

  const cycleBackground = () => {
    const current =
      painter.settings.background

    if (current === 'camera') {
      painter.freeze()
      return
    }

    if (current === 'frozen') {
      painter.patch({
        background: 'black',
      })

      return
    }

    painter.patch({
      background: 'camera',
    })
  }

  const openSettings = (
    tab: SettingsTab,
  ) => {
    setSettingsTab(tab)
    setPanel('settings')
  }

  const keyboardActions =
    useMemo(
      () => ({
        togglePainting: () =>
          painter.setPainting(
            !painter.painting,
          ),
        clear,
        capture: () => {
          void capture()
        },
        toggleRecording: () => {
          if (recorder.recording) {
            recorder.stop()
          } else {
            recorder.start()
          }
        },
        cycleMode,
        toggleFocus: () => {
          setFocus(
            (value) => !value,
          )
        },
        cycleBackground,
        closePanel: () => {
          setPanel(null)
        },
      }),
      [
        painter.painting,
        painter.settings.mode,
        painter.settings.background,
        recorder.recording,
      ],
    )

  useKeyboard(keyboardActions)

  return (
    <main
      onMouseMove={showControls}
      onTouchStart={showControls}
      className="camera-noise relative h-full overflow-hidden bg-black text-white"
    >
      <canvas
        ref={canvasRef}
        aria-label={`Light Painter canvas. Mode ${painter.settings.mode}. ${
          painter.painting
            ? 'Painting'
            : 'Paused'
        }.`}
        className="absolute inset-0 h-full w-full"
      />

      <TopBar
        exposureMs={exposureMs}
        mode={
          painter.settings.mode
        }
        focus={focus}
        sourceKind={
          media.sourceKind
        }
        onAbout={() =>
          setPanel('about')
        }
      />

      {firstRun && (
        <FirstRunOverlay
          state={firstRun}
          onStart={() => {
            void startFirstRun()
          }}
        />
      )}

      {!firstRun && (
        <ControlBar
          painting={
            painter.painting
          }
          recording={
            recorder.recording
          }
          focus={focus}
          visible={
            controlsVisible ||
            recorder.recording
          }
          onTogglePainting={() =>
            painter.setPainting(
              !painter.painting,
            )
          }
          onClear={clear}
          onCapture={() => {
            void capture()
          }}
          onMode={() =>
            openSettings('mode')
          }
          onExposure={() =>
            openSettings(
              'exposure',
            )
          }
          onMore={() =>
            openSettings('more')
          }
          onStopRecording={
            recorder.stop
          }
        />
      )}

      {recorder.recording && (
        <div className="absolute left-4 top-16 z-20 flex items-center gap-2 rounded-full bg-black/38 px-3 py-2 text-[9px] tracking-[0.15em] backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-red-500" />
          REC
          <span className="text-white/48">
            {Math.floor(
              recorder.duration /
                1000,
            )
              .toString()
              .padStart(2, '0')}
          </span>
        </div>
      )}

      {painter.toast && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/12 bg-black/62 px-4 py-3 text-[9px] tracking-[0.13em] text-white/72 backdrop-blur-xl">
          {painter.toast}
        </div>
      )}

      {!painter.painting &&
        !firstRun &&
        !panel &&
        !captureBlob &&
        !recorder.recording && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-black/32 px-4 py-3 text-[9px] tracking-[0.17em] text-white/58 backdrop-blur-md">
            PAUSED.
          </div>
        )}

      {panel === 'settings' && (
        <SettingsPanel
          tab={settingsTab}
          settings={
            painter.settings
          }
          preset={painter.preset}
          autoQuality={
            painter.autoQuality
          }
          media={media}
          onClose={() =>
            setPanel(null)
          }
          onPatch={painter.patch}
          onPreset={
            painter.applyPreset
          }
          onFreeze={
            painter.freeze
          }
          onCheckpoint={
            painter.checkpoint
          }
          onRestore={
            painter.restore
          }
          onEngine={() => {
            setPanel('engine')
          }}
          onGallery={() => {
            setPanel('gallery')
          }}
          onRecord={() => {
            setPanel(null)
            recorder.start()
          }}
          onFocus={() => {
            setPanel(null)
            setFocus(true)
          }}
          onCalibrate={() => {
            void painter.calibrate()
          }}
          onAutoQuality={
            painter.setAutoQuality
          }
        />
      )}

      {panel === 'engine' && (
        <EnginePanel
          view={
            painter.debugView
          }
          stats={painter.stats}
          onView={
            painter.setDebugView
          }
          onClose={() => {
            painter.setDebugView(
              'final',
            )

            setPanel(null)
          }}
        />
      )}

      {panel === 'about' && (
        <InfoPanel
          page="about"
          onClose={() =>
            setPanel(null)
          }
        />
      )}

      {panel === 'privacy' && (
        <InfoPanel
          page="privacy"
          onClose={() =>
            setPanel(null)
          }
        />
      )}

      {panel === 'gallery' && (
        <GalleryPanel
          onClose={() =>
            setPanel(null)
          }
        />
      )}

      {captureBlob &&
        canvasRef.current && (
          <CapturePanel
            blob={captureBlob}
            canvas={
              canvasRef.current
            }
            mode={
              painter.settings.mode
            }
            onClose={
              closeCapture
            }
            onToast={
              painter.setToast
            }
          />
        )}

      {recorder.blob &&
        !recorder.recording && (
          <RecordingPanel
            blob={recorder.blob}
            duration={
              recorder.duration
            }
            mode={
              painter.settings.mode
            }
            onClose={
              recorder.discard
            }
            onDiscard={
              recorder.discard
            }
            onToast={
              painter.setToast
            }
          />
        )}

      {focus && (
        <button
          type="button"
          onClick={() =>
            setFocus(false)
          }
          className="absolute right-4 top-4 z-30 rounded-full border border-white/12 bg-black/28 px-4 py-3 text-[8px] tracking-[0.13em] text-white/48 backdrop-blur-md hover:text-white"
        >
          EXIT FOCUS
        </button>
      )}

      <div
        className="sr-only"
        aria-live="polite"
      >
        Mode{' '}
        {painter.settings.mode}.
        {painter.painting
          ? ' Painting.'
          : ' Paused.'}
        Engine{' '}
        {painter.stats.engine}.
      </div>
    </main>
  )
}