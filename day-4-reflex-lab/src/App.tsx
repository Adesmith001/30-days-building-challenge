import {
  useState,
} from 'react'

import {
  HomeScreen,
} from './components/HomeScreen'

import {
  ModeComplete,
} from './components/ModeComplete'

import {
  ModeSelect,
} from './components/ModeSelect'

import {
  ResultsScreen,
} from './components/ResultsScreen'

import {
  MODES,
} from './data/gameConfig'

import {
  useSession,
} from './hooks/useSession'

import {
  initAudio,
} from './lib/audio'

import {
  AudioTest,
} from './modes/AudioTest'

import {
  ChoiceTest,
} from './modes/ChoiceTest'

import {
  FakeoutTest,
} from './modes/FakeoutTest'

import {
  VisualTest,
} from './modes/VisualTest'

import type {
  Mode,
  RoundInput,
} from './types/game'

type Screen =
  | 'home'
  | 'select'
  | 'game'
  | 'complete'
  | 'results'

export default function App() {
  const [
    screen,
    setScreen,
  ] = useState<Screen>('home')

  const [
    activeMode,
    setActiveMode,
  ] =
    useState<Mode>('visual')

  const [
    cleanCount,
    setCleanCount,
  ] = useState(0)

  const session =
    useSession()

  function openLab() {
    initAudio()

    setScreen('select')
  }

  function startFull() {
    session.start('full')

    setActiveMode('visual')

    setScreen('game')
  }

  function startQuick(
    mode: Mode,
  ) {
    session.start('quick')

    setActiveMode(mode)

    setScreen('game')
  }

  function handleRound(
    input: RoundInput,
  ) {
    return session
      .submitRound(input)
  }

  function finishMode(
    clean: number,
  ) {
    setCleanCount(clean)

    session.finishMode(
      activeMode,
      clean,
    )

    setScreen('complete')
  }

  function continueAfterMode() {
    if (
      session.kind === 'quick'
    ) {
      session.finishSession()

      setScreen('results')

      return
    }

    const currentIndex =
      MODES.indexOf(
        activeMode,
      )

    const lastMode =
      currentIndex ===
      MODES.length - 1

    if (lastMode) {
      session.finishSession()

      setScreen('results')

      return
    }

    setActiveMode(
      MODES[
        currentIndex + 1
      ],
    )

    setScreen('game')
  }

  function replay() {
    if (
      session.kind === 'full'
    ) {
      startFull()

      return
    }

    startQuick(
      activeMode,
    )
  }

  const commonProps = {
    score:
      session.total,

    combo:
      session.combo,

    onRound:
      handleRound,

    onComplete:
      finishMode,
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        onStart={openLab}
      />
    )
  }

  if (screen === 'select') {
    return (
      <ModeSelect
        onFull={startFull}
        onQuick={startQuick}
      />
    )
  }

  if (
    screen === 'complete'
  ) {
    return (
      <ModeComplete
        mode={activeMode}
        points={
          session.modePoints[
            activeMode
          ] ?? 0
        }
        clean={cleanCount}
        bonus={
          session.modeBonuses[
            activeMode
          ] ?? 0
        }
        kind={session.kind}
        onContinue={
          continueAfterMode
        }
      />
    )
  }

  if (
    screen === 'results'
  ) {
    return (
      <ResultsScreen
        rounds={
          session.rounds
        }
        total={
          session.total
        }
        kind={
          session.kind
        }
        newPb={
          session.newPb
        }
        bests={
          session.bests
        }
        onReplay={
          replay
        }
        onMenu={() =>
          setScreen(
            'select',
          )
        }
      />
    )
  }

  if (
    activeMode === 'visual'
  ) {
    return (
      <VisualTest
        {...commonProps}
      />
    )
  }

  if (
    activeMode === 'audio'
  ) {
    return (
      <AudioTest
        {...commonProps}
      />
    )
  }

  if (
    activeMode === 'choice'
  ) {
    return (
      <ChoiceTest
        {...commonProps}
      />
    )
  }

  return (
    <FakeoutTest
      {...commonProps}
    />
  )
}