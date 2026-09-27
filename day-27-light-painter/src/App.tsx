/* eslint-disable react-hooks/refs */
import {
  useState,
  useEffect,
} from 'react'

import {
  CameraError,
} from './components/screens/CameraError'

import {
  ImportVideo,
} from './components/screens/ImportVideo'

import {
  Landing,
} from './components/screens/Landing'

import {
  Privacy,
} from './components/screens/Privacy'

import {
  Studio,
} from './components/studio/Studio'

import {
  useMediaSource,
} from './hooks/use-media-source'

type Phase =
  | 'landing'
  | 'privacy'
  | 'requesting'
  | 'import'
  | 'studio'
  | 'error'

type Route =
  | '/'
  | '/how-it-works'

function getRoute(): Route {
  return window.location.pathname === '/how-it-works'
    ? '/how-it-works'
    : '/'
}

export default function App() {
  const media =
    useMediaSource()

  const [route, setRoute] =
    useState<Route>(getRoute)

  const [phase, setPhase] =
    useState<Phase>(() =>
      route === '/how-it-works'
        ? 'privacy'
        : 'landing',
    )

  useEffect(() => {
    const onPopState = () => {
      setRoute(getRoute())
      setPhase('landing')
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const goTo = (nextRoute: Route) => {
    window.history.pushState({}, '', nextRoute)
    setRoute(nextRoute)
    setPhase(
      nextRoute === '/how-it-works'
        ? 'privacy'
        : 'landing',
    )
  }

  const openCamera =
    async () => {
      setPhase('requesting')

      const opened =
        await media.openCamera()

      setPhase(
        opened
          ? 'studio'
          : 'error',
      )
    }

  const openVideo =
    async (file: File) => {
      const opened =
        await media.openFile(file)

      setPhase(
        opened
          ? 'studio'
          : 'error',
      )
    }

  return (
    <div className="h-[100dvh] w-full bg-[#050505]">
      <video
        ref={media.videoRef}
        playsInline
        muted
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-video w-[min(88vw,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] object-cover opacity-100"
      />

      {phase === 'landing' && route === '/' && (
        <Landing
          onOpen={() =>
            setPhase('privacy')
          }
          onHow={() =>
            goTo('/how-it-works')
          }
        />
      )}

      {phase === 'privacy' && (
        <Privacy
          onContinue={() => {
            void openCamera()
          }}
          onVideo={() =>
            setPhase('import')
          }
          onBack={() =>
            goTo('/')
          }
        />
      )}

      {phase ===
        'requesting' && (
        <main className="grid h-full place-items-center bg-[#050505] text-white">
          <div className="text-center">
            <div className="mx-auto mb-6 size-5 animate-spin rounded-full border border-white/18 border-t-white/70" />

            <p className="text-[11px] leading-5 tracking-[0.18em] text-white/64">
              WAITING FOR
              <br />
              CAMERA ACCESS...
            </p>
          </div>
        </main>
      )}

      {phase === 'import' && (
        <ImportVideo
          onFile={(file) => {
            void openVideo(file)
          }}
          onBack={() =>
            setPhase('privacy')
          }
        />
      )}

      {phase === 'error' && (
        <CameraError
          message={media.error}
          onRetry={() => {
            void openCamera()
          }}
          onVideo={() =>
            setPhase('import')
          }
        />
      )}

      {phase === 'studio' && (
        <Studio media={media} />
      )}
    </div>
  )
}
