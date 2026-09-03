type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export function playTone(
  frequency: number,
  duration = 0.08,
) {
  const extendedWindow =
    window as AudioWindow;

  const AudioContextClass =
    window.AudioContext ||
    extendedWindow.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator =
    context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gain.gain.setValueAtTime(
    0.06,
    context.currentTime,
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + duration,
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();

  oscillator.stop(
    context.currentTime + duration,
  );
}