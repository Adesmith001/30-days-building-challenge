const pick = (items: string[]) => {
  return items[
    Math.floor(Math.random() * items.length)
  ]
}

export function reactionCopy(ms?: number) {
  if (ms === undefined) {
    return {
      label: 'NO SCORE',
      flavor: 'Try again.',
    }
  }

  if (ms < 160) {
    return {
      label: 'LIGHTNING',
      flavor: pick([
        'OMO.',
        'WHO SEND YOU?',
        'TOO SHARP.',
      ]),
    }
  }

  if (ms < 180) {
    return {
      label: 'SHARP SHARP',
      flavor: pick([
        'Correct person.',
        'Locked in.',
        'No dulling.',
      ]),
    }
  }

  if (ms < 220) {
    return {
      label: 'CORRECT.',
      flavor: pick([
        'Clean.',
        'You dey enter am.',
        'Steady.',
      ]),
    }
  }

  if (ms < 280) {
    return {
      label: 'NOT BAD.',
      flavor: pick([
        'You dey try.',
        'Still sharp.',
        'We move.',
      ]),
    }
  }

  if (ms < 350) {
    return {
      label: 'YOU DEY TRY.',
      flavor: pick([
        'Small small.',
        'Wake up small.',
        'Still inside.',
      ]),
    }
  }

  if (ms < 450) {
    return {
      label: 'WAKE UP.',
      flavor: pick([
        'No sleeping.',
        'My guy, focus.',
        'E slow small.',
      ]),
    }
  }

  return {
    label: 'MY GUY…',
    flavor: pick([
      'E dey load.',
      'Run am back.',
      'Network issue?',
    ]),
  }
}

export function failureCopy(
  reason?: string,
) {
  if (reason === 'wrong-choice') {
    return {
      label: 'WRONG WAY.',
      flavor: 'Ah-ah.',
    }
  }

  if (reason === 'fakeout') {
    return {
      label: 'YOU FALL FOR AM.',
      flavor: 'Pressure got to you.',
    }
  }

  return {
    label: 'TOO SOON.',
    flavor: pick([
      'Easy, boss.',
      'Nobody dey pursue you.',
      'You jump gun.',
      'Calm down small.',
    ]),
  }
}

export function comboCopy(
  combo: number,
) {
  if (combo >= 6) {
    return 'YOU DON ENTER ZONE.'
  }

  if (combo === 5) {
    return 'NO DULLING.'
  }

  if (combo === 4) {
    return 'LOCKED IN.'
  }

  if (combo === 3) {
    return 'YOU DEY ENTER AM.'
  }
  if (combo === 2) {
    return 'OMOO, YOU DEY TRY.'
  }
  if (combo === 1) {
    return 'GBAM! E DON FINISH.'
  }
  return ''
}