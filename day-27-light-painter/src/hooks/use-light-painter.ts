/* eslint-disable react-hooks/exhaustive-deps */
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { calibrateVideo } from '../lib/calibrate'
import {
  DEFAULT_SETTINGS,
  getPreset,
} from '../lib/presets'

import type {
  DebugView,
  PainterEngine,
  PainterSettings,
  PainterStats,
  PresetName,
} from '../types/painter'

import { createPainterEngine } from '../webgl/create-engine'

export function useLightPainter(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  sourceVersion: number,
) {
  const engineRef =
    useRef<PainterEngine | null>(null)

  const settingsRef =
    useRef(DEFAULT_SETTINGS)

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS)

  const [preset, setPreset] =
    useState<PresetName>('trails')

  const [painting, setPainting] =
    useState(false)

  const [debugView, setDebugView] =
    useState<DebugView>('final')

  const [stats, setStats] =
    useState<PainterStats>({
      fps: 0,
      width: 0,
      height: 0,
      engine: 'WEBGL2',
    })

  const [autoQuality, setAutoQuality] =
    useState(true)

  const [toast, setToast] =
    useState('')

  const lowFpsCount =
    useRef(0)

  useEffect(() => {
    settingsRef.current =
      settings

    engineRef.current?.updateSettings(
      settings,
    )
  }, [settings])

  useEffect(() => {
    engineRef.current?.setPainting(
      painting,
    )
  }, [painting])

  useEffect(() => {
    engineRef.current?.setDebugView(
      debugView,
    )
  }, [debugView])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const boot = () => {
      if (engineRef.current) return

      const engine =
        createPainterEngine(
          video,
          canvas,
          settingsRef.current,
          (nextStats) => {
            setStats(nextStats)
          },
        )

      engineRef.current = engine
      engine.setPainting(painting)
      engine.setDebugView(debugView)
      engine.start()

      if (engine.kind === 'basic') {
        setToast(
          'BASIC MODE · WEBGL2 UNAVAILABLE',
        )
      }
    }

    if (video.readyState >= 1) {
      boot()
    }

    video.addEventListener(
      'loadedmetadata',
      boot,
    )

    const resize = () => {
      engineRef.current?.resize()
    }

    window.addEventListener(
      'resize',
      resize,
    )

    return () => {
      video.removeEventListener(
        'loadedmetadata',
        boot,
      )

      window.removeEventListener(
        'resize',
        resize,
      )

      engineRef.current?.stop()
      engineRef.current = null
    }
  }, [
    canvasRef,
    videoRef,
  ])

  useEffect(() => {
    if (!sourceVersion) return

    engineRef.current?.resetSource()
  }, [sourceVersion])

  useEffect(() => {
    if (
      !autoQuality ||
      stats.fps <= 0 ||
      stats.engine !== 'WEBGL2'
    ) {
      return
    }

    if (stats.fps < 24) {
      lowFpsCount.current += 1
    } else {
      lowFpsCount.current = 0
    }

    if (lowFpsCount.current < 3) {
      return
    }

    lowFpsCount.current = 0

    setSettings((current) => {
      if (
        current.quality === 'high'
      ) {
        setToast(
          'PROCESSING QUALITY · HIGH → BALANCED',
        )

        return {
          ...current,
          quality: 'balanced',
        }
      }

      if (
        current.quality ===
        'balanced'
      ) {
        setToast(
          'PROCESSING QUALITY · BALANCED → LOW',
        )

        return {
          ...current,
          quality: 'low',
        }
      }

      return current
    })
  }, [
    autoQuality,
    stats,
  ])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(
      () => {
        setToast('')
      },
      2600,
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [toast])

  const patch = useCallback(
    (
      next: Partial<PainterSettings>,
    ) => {
      setSettings((current) => ({
        ...current,
        ...next,
      }))

      setPreset('custom')
    },
    [],
  )

  const applyPreset = useCallback(
    (next: PresetName) => {
      const presetSettings =
        getPreset(next)

      setSettings((current) => ({
        ...presetSettings,
        mirror: current.mirror,
        quality: current.quality,
      }))

      setPreset(next)

      if (
        next === 'portrait'
      ) {
        engineRef.current
          ?.freezeBackground()
      }
    },
    [],
  )

  const freeze = useCallback(() => {
    engineRef.current
      ?.freezeBackground()

    patch({
      background: 'frozen',
    })

    setToast(
      'BACKGROUND FROZEN.',
    )
  }, [patch])

  const clear = useCallback(() => {
    engineRef.current?.clear()

    setToast(
      'CANVAS CLEARED · UNDO AVAILABLE',
    )
  }, [])

  const undoClear =
    useCallback(() => {
      const restored =
        engineRef.current
          ?.undoClear()

      if (restored) {
        setToast(
          'CLEAR UNDONE.',
        )
      }
    }, [])

  const checkpoint =
    useCallback(() => {
      engineRef.current
        ?.saveCheckpoint()

      setToast(
        'CHECKPOINT SAVED.',
      )
    }, [])

  const restore =
    useCallback(() => {
      const restored =
        engineRef.current
          ?.restoreCheckpoint()

      if (restored) {
        setToast(
          'CHECKPOINT RESTORED.',
        )
      }
    }, [])

  const calibrate =
    useCallback(async () => {
      const video =
        videoRef.current

      if (!video) return

      const result =
        await calibrateVideo(video)

      setSettings((current) => ({
        ...current,
        ...result,
      }))

      setToast('READY.')
    }, [videoRef])

  return {
    settings,
    preset,
    painting,
    debugView,
    stats,
    autoQuality,
    toast,

    setPainting,
    setDebugView,
    setAutoQuality,
    setToast,

    patch,
    applyPreset,

    freeze,
    clear,
    undoClear,
    checkpoint,
    restore,
    calibrate,
  }
}