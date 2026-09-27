export const SOURCE_URL =
  import.meta.env.VITE_SOURCE_URL || ''

export const MODE_DESCRIPTION = {
  light: 'BRIGHT MOVEMENT BECOMES TRAIL.',
  ghost: 'MOVEMENT BECOMES EXPOSURE.',
  color: 'KEEP SOURCE COLORS.',
  neon: 'LIGHT BECOMES COLOUR.',
} as const

export const NEON_COLORS = [
  {
    name: 'WHITE',
    value: '#ffffff',
  },
  {
    name: 'CYAN',
    value: '#65e8ff',
  },
  {
    name: 'MAGENTA',
    value: '#ff5ccf',
  },
  {
    name: 'ORANGE',
    value: '#ff9f4d',
  },
  {
    name: 'GREEN',
    value: '#7cff87',
  },
] as const