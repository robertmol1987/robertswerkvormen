/**
 * Sound effects generated purely via the Web Audio API.
 * No external files required.
 */

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!window._sfxCtx) {
    try {
      window._sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return window._sfxCtx;
}

function resume(ctx) {
  if (ctx.state === "suspended") ctx.resume();
}

/** 1 — Dice rolling: rapid rattling clicks that speed up then slow down */
export function playDiceRoll(durationMs = 3600) {
  const ctx = getAudioContext();
  if (!ctx) return;
  resume(ctx);

  const now = ctx.currentTime;
  const duration = durationMs / 1000;

  // Schedule a series of short "click" bursts
  // Density: starts sparse, peaks mid-way, slows near end
  const totalClicks = 28;
  for (let i = 0; i < totalClicks; i++) {
    // Ease in-out timing: sin-based distribution
    const t = i / (totalClicks - 1);
    const phase = Math.sin(t * Math.PI); // 0→1→0 arc
    // More clicks in the middle: map so they cluster around centre
    const time = now + t * duration * 0.92 + Math.random() * 0.06;

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.035, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let s = 0; s < data.length; s++) {
      const env = Math.exp(-s / (ctx.sampleRate * 0.008));
      data[s] = (Math.random() * 2 - 1) * env * 0.6;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const gain = ctx.createGain();
    // Quieter at the very start and end, louder in the middle
    const vol = 0.3 + phase * 0.55;
    gain.gain.setValueAtTime(vol, time);

    // Slight pitch variation per click
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800 + Math.random() * 1200;
    filter.Q.value = 0.8;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(time);
  }
}

/** 2 — Reveal: rising sparkle arpeggio + soft pad chord */
export function playReveal() {
  const ctx = getAudioContext();
  if (!ctx) return;
  resume(ctx);

  const now = ctx.currentTime;

  // Rising arpeggio notes (pentatonic)
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 E5 G5 C6 E6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 0.5, now + i * 0.09);
    osc.frequency.exponentialRampToValueAtTime(freq, now + i * 0.09 + 0.06);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + i * 0.09);
    gain.gain.linearRampToValueAtTime(0.18, now + i * 0.09 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.09);
    osc.stop(now + i * 0.09 + 0.6);
  });

  // Soft background pad chord (C major)
  const padFreqs = [261.63, 329.63, 392.0];
  padFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.35);
    gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.1);
    osc.stop(now + 2.1);
  });

  // Shimmer: high-frequency noise burst
  const shimBuf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
  const shimData = shimBuf.getChannelData(0);
  for (let s = 0; s < shimData.length; s++) {
    shimData[s] =
      (Math.random() * 2 - 1) * Math.exp(-s / (ctx.sampleRate * 0.04));
  }
  const shimSrc = ctx.createBufferSource();
  shimSrc.buffer = shimBuf;
  const shimFilter = ctx.createBiquadFilter();
  shimFilter.type = "highpass";
  shimFilter.frequency.value = 6000;
  const shimGain = ctx.createGain();
  shimGain.gain.value = 0.25;
  shimSrc.connect(shimFilter);
  shimFilter.connect(shimGain);
  shimGain.connect(ctx.destination);
  shimSrc.start(now + 0.38);
}

/** 3 — Card open: warm rising melody + soft pad, ~1.5s */
export function playCardOpen() {
  const ctx = getAudioContext();
  if (!ctx) return;
  resume(ctx);

  const now = ctx.currentTime;

  // Rising melody — 3 notes stepping up
  const melodyNotes = [
    { freq: 349.23, time: 0, dur: 0.55 }, // F4
    { freq: 440.0, time: 0.13, dur: 0.5 }, // A4
    { freq: 523.25, time: 0.26, dur: 0.8 }, // C5 (longest, the "arrival")
  ];

  melodyNotes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 0.85, now + time);
    osc.frequency.exponentialRampToValueAtTime(freq, now + time + 0.06);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + time);
    gain.gain.linearRampToValueAtTime(0.16, now + time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + dur + 0.05);
  });

  // Soft pad chord (F major: F3 A3 C4) fades in gently
  const padFreqs = [174.61, 220.0, 261.63];
  padFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.035, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.05);
    osc.stop(now + 1.7);
  });

  // Quick soft "pop" at the very start (air feel)
  const popBuf = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
  const popData = popBuf.getChannelData(0);
  for (let s = 0; s < popData.length; s++) {
    popData[s] =
      (Math.random() * 2 - 1) * Math.exp(-s / (ctx.sampleRate * 0.018));
  }
  const popSrc = ctx.createBufferSource();
  popSrc.buffer = popBuf;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 700;
  const popGain = ctx.createGain();
  popGain.gain.value = 0.14;
  popSrc.connect(lowpass);
  lowpass.connect(popGain);
  popGain.connect(ctx.destination);
  popSrc.start(now);

  // Gentle shimmer when the card fully "opens"
  const shimBuf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
  const shimData = shimBuf.getChannelData(0);
  for (let s = 0; s < shimData.length; s++) {
    shimData[s] =
      (Math.random() * 2 - 1) * Math.exp(-s / (ctx.sampleRate * 0.03));
  }
  const shimSrc = ctx.createBufferSource();
  shimSrc.buffer = shimBuf;
  const shimFilter = ctx.createBiquadFilter();
  shimFilter.type = "highpass";
  shimFilter.frequency.value = 5000;
  const shimGain = ctx.createGain();
  shimGain.gain.value = 0.15;
  shimSrc.connect(shimFilter);
  shimFilter.connect(shimGain);
  shimGain.connect(ctx.destination);
  shimSrc.start(now + 0.28);
}

/** 4 — Card close: soft descending tone + air release */
export function playCardClose() {
  const ctx = getAudioContext();
  if (!ctx) return;
  resume(ctx);

  const now = ctx.currentTime;

  // Descending tone (C5 → F4)
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.exponentialRampToValueAtTime(280, now + 0.18);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.12, now + 0.03);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);

  // Soft air "puff" (filtered noise)
  const puffBuf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
  const puffData = puffBuf.getChannelData(0);
  for (let s = 0; s < puffData.length; s++) {
    puffData[s] =
      (Math.random() * 2 - 1) * Math.exp(-s / (ctx.sampleRate * 0.02));
  }
  const puffSrc = ctx.createBufferSource();
  puffSrc.buffer = puffBuf;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;
  const puffGain = ctx.createGain();
  puffGain.gain.value = 0.1;
  puffSrc.connect(lp);
  lp.connect(puffGain);
  puffGain.connect(ctx.destination);
  puffSrc.start(now + 0.02);
}
