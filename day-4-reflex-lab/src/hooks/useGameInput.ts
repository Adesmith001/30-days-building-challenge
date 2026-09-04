import {
  useEffect,
} from 'react'

export function useGameInput(
  handler: (key: string) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.repeat) {
        return
      }

      handler(event.key)
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
  }, [
    enabled,
    handler,
  ])
}