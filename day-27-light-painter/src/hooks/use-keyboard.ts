import { useEffect } from 'react'

interface KeyboardActions {
  togglePainting(): void
  clear(): void
  capture(): void
  toggleRecording(): void
  cycleMode(): void
  toggleFocus(): void
  cycleBackground(): void
  closePanel(): void
}

function isTyping(
  target: EventTarget | null,
) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tag =
    target.tagName.toLowerCase()

  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  )
}

export function useKeyboard(
  actions: KeyboardActions,
) {
  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (isTyping(event.target)) {
        return
      }

      const key =
        event.key.toLowerCase()

      if (event.code === 'Space') {
        event.preventDefault()
        actions.togglePainting()
      } else if (key === 'c') {
        actions.clear()
      } else if (key === 'p') {
        actions.capture()
      } else if (key === 'r') {
        actions.toggleRecording()
      } else if (key === 'm') {
        actions.cycleMode()
      } else if (key === 'f') {
        actions.toggleFocus()
      } else if (key === 'b') {
        actions.cycleBackground()
      } else if (
        event.key === 'Escape'
      ) {
        actions.closePanel()
      }
    }

    window.addEventListener(
      'keydown',
      onKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        onKeyDown,
      )
    }
  }, [actions])
}