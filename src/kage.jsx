import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { memories } from "./memories.js";
const PhotoOrbit = lazy(() => import("./PhotoOrbit.jsx"));
import "./kage.css";



function createAmbientAudio() {
  const context = new window.AudioContext();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(3);
  const feedback = context.createGain();
  const lfo = context.createOscillator();
  const depth = context.createGain();
  const oscillators = [];

  master.gain.value = 0;
  filter.type = "lowpass";
  filter.frequency.value = 720;
  delay.delayTime.value = 0.42;
  feedback.gain.value = 0.16;
  filter.connect(master);
  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(master);
  master.connect(context.destination);
  lfo.frequency.value = 0.07;
  depth.gain.value = 150;
  lfo.connect(depth);
  depth.connect(filter.frequency);
  lfo.start();

  [[110, 0.24], [164.81, 0.13], [220, 0.12], [261.63, 0.09], [329.63, 0.05]].forEach(([frequency, volume], i) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = i === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = i % 2 ? -4 : 3;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start();
    oscillators.push(oscillator);
  });

  const notes = [523.25, 493.88, 440, 392, 440, 587.33, 523.25, 493.88];
  let noteIndex = 0;
  const playNote = () => {
    const now = context.currentTime;
    const bell = context.createOscillator();
    const envelope = context.createGain();
    bell.type = "sine";
    bell.frequency.value = notes[noteIndex % notes.length];
    noteIndex += 1;
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.035, now + 0.07);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
    bell.connect(envelope);
    envelope.connect(filter);
    bell.onended = () => {
      const activeIndex = oscillators.indexOf(bell);
      if (activeIndex !== -1) oscillators.splice(activeIndex, 1);
      bell.disconnect();
      envelope.disconnect();
    };
    bell.start(now);
    bell.stop(now + 2.2);
    oscillators.push(bell);
  };
  playNote();
  return { context, master, oscillators, playNote, timer: null };
}

function Dreamscape() {
  const [selected, setSelected] = useState(5);
  const [musicOn, setMusicOn] = useState(false);
  const [entered, setEntered] = useState(false);
  const [entryVisible, setEntryVisible] = useState(true);
  const audioRef = useRef(null);
  const entryTimerRef = useRef(null);
  const sceneHeadingRef = useRef(null);
  const current = memories[selected];

  useEffect(() => () => {
    window.clearTimeout(entryTimerRef.current);
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(audio.timer);
    audio.oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* Already-ended notes need no cleanup. */ }
    });
    audio.context.close();
  }, []);

  useEffect(() => {
    if (entered) sceneHeadingRef.current?.focus();
  }, [entered]);

  const toggleMusic = async () => {
    try {
      if (!audioRef.current) audioRef.current = createAmbientAudio();
      const audio = audioRef.current;
      await audio.context.resume();
      const next = !musicOn;
      audio.master.gain.cancelScheduledValues(audio.context.currentTime);
      audio.master.gain.setTargetAtTime(next ? 0.62 : 0, audio.context.currentTime, 0.8);
      if (next && !audio.timer) audio.timer = window.setInterval(audio.playNote, 2600);
      if (!next) {
        window.clearInterval(audio.timer);
        audio.timer = null;
      }
      setMusicOn(next);
    } catch {
      setMusicOn(false);
    }
  };

  const beginExperience = (withMusic) => {
    setEntered(true);
    if (withMusic !== musicOn) void toggleMusic();
    entryTimerRef.current = window.setTimeout(() => setEntryVisible(false), 720);
  };

  const handlePickerKeyDown = (event) => {
    const increments = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let nextIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = memories.length - 1;
    else if (increments[event.key]) {
      nextIndex = (selected + increments[event.key] + memories.length) % memories.length;
    } else return;

    event.preventDefault();
    setSelected(nextIndex);
    event.currentTarget.querySelector(`[data-memory-index="${nextIndex}"]`)?.focus();
  };

  return (
    <main className={"dreamscape-page" + (entered ? " is-entered" : "")} id="main-content" tabIndex={-1}>
      <a className="skip-link" href={entered ? "#memory-picker" : "#entry-start"}>
        {entered ? "Skip to photo controls" : "Skip to enter the gallery"}
      </a>
      {entered && (
        <Suspense fallback={<div className="scene-loading" role="status">Arranging the memories…</div>}>
          <PhotoOrbit selected={selected} onSelect={setSelected} />
        </Suspense>
      )}
      <div className="dreamscape-wash" aria-hidden="true" />

      <header className="dreamscape-header">
        <a className="dreamscape-brand" href="./" aria-label="Back to A Little Hope">
          <span className="brand-seal">h</span><span>a little hope</span>
        </a>
        <div className="header-actions">
          <a className="back-link" href="./">Back to the letter</a>
          <button className={"sound-toggle" + (musicOn ? " is-playing" : "")} onClick={toggleMusic} aria-pressed={musicOn}>
            <span className="sound-icon" aria-hidden="true">{musicOn ? "♫" : "♪"}</span>
            {musicOn ? "Sound on" : "Play music"}
          </button>
        </div>
      </header>

      {entryVisible && (
        <section className={"entry-screen" + (entered ? " is-leaving" : "")} aria-labelledby="entry-title" aria-hidden={entered} inert={entered}>
          <div className="entry-content">
            <p className="scene-kicker"><span /> a small collection of moments</p>
            <h1 className="entry-title" id="entry-title">A little <em>universe</em><br />of you.</h1>
            <p className="entry-copy">Eight moments, held close<br />and still glowing.</p>
            <div className="entry-actions">
              <button className="entry-button entry-button-primary" id="entry-start" disabled={entered} onClick={() => beginExperience(true)}>
                Tap to begin <span aria-hidden="true">♫</span>
              </button>
              <button className="entry-button entry-button-quiet" disabled={entered} onClick={() => beginExperience(false)}>
                Enter quietly
              </button>
            </div>
            <p className="entry-note">Music is optional and can be turned off any time.</p>
          </div>
        </section>
      )}

      <section className="dreamscape-copy">
        <p className="scene-kicker"><span /> an album in orbit</p>
        <h1 ref={sceneHeadingRef} tabIndex={-1}>A little <em>universe</em><br />of you.</h1>
        <p className="scene-caption">Eight moments, held close<br />and still glowing.</p>
        <div className="memory-label" role="status" aria-live="polite" aria-atomic="true">
          <span className="memory-index">{String(selected + 1).padStart(2, "0")}</span>
          <span className="memory-rule" />
          <span>{current.title}</span>
        </div>
        {current.date && <p className="memory-date">{current.date}</p>}
        {current.note && <p className="memory-note">{current.note}</p>}
      </section>

      <nav
        className="memory-picker"
        id="memory-picker"
        tabIndex={-1}
        aria-label="Choose a photograph"
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End"
        onKeyDown={handlePickerKeyDown}
      >
        {memories.map((memory, index) => (
          <button
            className={"memory-dot" + (index === selected ? " is-active" : "")}
            key={memory.src}
            data-memory-index={index}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            aria-label={"Show " + memory.title}
            aria-current={index === selected ? "true" : undefined}
          ><span /></button>
        ))}
      </nav>

      <footer className="dreamscape-footer">
        <span className="footer-hint footer-hint-desktop">scroll for a random zoom <i>·</i> drag to wander</span>
        <span className="footer-hint footer-hint-mobile">swipe to move <i>·</i> tap a memory to focus</span>
        <span className="footer-mark">made with care <b>♡</b></span>
      </footer>

    </main>
  );
}

createRoot(document.getElementById("root")).render(<Dreamscape />);
