import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { GameState } from "../types/game";

export function DeliveryFeedback({ state }: { state: GameState }) {
  const [sound, setSound] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const lastDelivery = useRef(state.delivery?.id);
  const reducedMotion = useReducedMotion();
  const delivery = state.delivery;
  const nextMilestone = [1, 10, 25, 50, 100, 250, 500].find((n) => n > state.stats.delivered);
  const visible = delivery && state.now - delivery.at < 4_000;

  useEffect(() => () => { void audio.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (lastDelivery.current === delivery?.id) return;
    lastDelivery.current = delivery?.id;
    const context = audio.current;
    if (!sound || !delivery || !context || context.state !== "running") return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.setValueAtTime(delivery.milestone ? 1046 : 880, context.currentTime + 0.1);
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.32);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }, [delivery, sound]);

  async function toggleSound() {
    if (sound) { setSound(false); return; }
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
      setSound(true);
    } catch { setUnavailable(true); }
  }

  return <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#918976] bg-[#f7f4ef] px-3 py-1 text-[11px]">
    <div className="min-w-0" role="status" aria-live="polite" aria-atomic="true">
      {visible ? <motion.div key={delivery.id} initial={reducedMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
        <strong className="text-[#25613d]">+₦{delivery.fare.toLocaleString()} fares</strong>
        <span> · {delivery.count} delivered</span>
        {delivery.milestone && <span className="ml-2 font-black">{delivery.milestone === 1 ? "First delivery!" : `${delivery.milestone} passengers moved!`}</span>}
      </motion.div> : <span><strong>{state.stats.delivered}</strong> passengers moved{nextMilestone ? ` / Next milestone: ${nextMilestone}` : " / Lagos legend"}</span>}
    </div>
    <button onClick={toggleSound} aria-pressed={sound} disabled={unavailable} className="min-h-11 shrink-0 cursor-pointer px-2 underline disabled:opacity-50">
      {unavailable ? "Sound unavailable" : `Sound ${sound ? "on" : "off"}`}
    </button>
  </div>;
}
