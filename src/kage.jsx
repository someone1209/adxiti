import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./kage.css";
import photo1 from "../images/photo1.jpg";
import photo2 from "../images/photo2.jpg";
import photo3 from "../images/photo3.jpg";
import photo4 from "../images/photo4.jpg";
import photo5 from "../images/photo5.jpg";
import photo6 from "../images/photo6.jpg";
import photo7 from "../images/photo7.jpg";
import photo8 from "../images/photo8.jpg";

const memories = [
  { src: photo1, title: "A little hello" },
  { src: photo2, title: "A playful moment", rotate: true },
  { src: photo3, title: "In your colors" },
  { src: photo4, title: "Framed with love" },
  { src: photo5, title: "Sunday glow" },
  { src: photo6, title: "That bright smile" },
  { src: photo7, title: "A favorite laugh" },
  { src: photo8, title: "A soft little pause", rotate: true, rotation: Math.PI / 2 },
];

function PhotoOrbit({ selected, onSelect }) {
  const mountRef = useRef(null);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);
  const previousSelectionRef = useRef(selected);
  const transitionRef = useRef(null);

  useEffect(() => {
    if (previousSelectionRef.current !== selected) {
      transitionRef.current = {
        from: previousSelectionRef.current,
        to: selected,
        started: null,
      };
      previousSelectionRef.current = selected;
    }
    selectedRef.current = selected;
    onSelectRef.current = onSelect;
  }, [selected, onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      mount.dataset.error = "true";
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "orbit-canvas";
    renderer.domElement.setAttribute("aria-label", "Floating 3D gallery of photographs");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 80);
    camera.position.set(0, 0.2, 10.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 7.5;
    controls.maxDistance = 14;
    controls.minPolarAngle = Math.PI * 0.36;
    controls.maxPolarAngle = Math.PI * 0.64;

    let wheelDelta = 0;
    let lastWheelAt = 0;
    const onWheel = (event) => {
      wheelDelta += event.deltaY;
      const now = performance.now();
      if (Math.abs(wheelDelta) < 72 || now - lastWheelAt < 360) return;
      wheelDelta = 0;
      lastWheelAt = now;
      const current = selectedRef.current;
      const choices = memories.map((_, index) => index).filter((index) => index !== current);
      onSelectRef.current(choices[Math.floor(Math.random() * choices.length)]);
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const roseLight = new THREE.PointLight(0xd97f94, 24, 22);
    roseLight.position.set(-4, 3, 5);
    scene.add(roseLight);
    const candleLight = new THREE.PointLight(0xf3c28d, 15, 18);
    candleLight.position.set(4, -2, -2);
    scene.add(candleLight);

    const starPositions = new Float32Array(520 * 3);
    for (let i = 0; i < 520; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 28;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      starPositions[i * 3 + 2] = -5 - Math.random() * 18;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xe8c5ca, size: 0.035, transparent: true, opacity: 0.7 }),
    );
    scene.add(stars);

    const moteCount = 96;
    const motePositions = new Float32Array(moteCount * 3);
    const motes = Array.from({ length: moteCount }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 11,
      z: -3.8 + Math.random() * 5.5,
      speed: 0.08 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2,
    }));
    motes.forEach((mote, index) => {
      motePositions[index * 3] = mote.x;
      motePositions[index * 3 + 1] = mote.y;
      motePositions[index * 3 + 2] = mote.z;
    });
    const moteGeometry = new THREE.BufferGeometry();
    moteGeometry.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
    const moteField = new THREE.Points(
      moteGeometry,
      new THREE.PointsMaterial({
        color: 0xf5b9d2,
        size: 0.055,
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    scene.add(moteField);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const neonDecor = new THREE.Group();
    scene.add(neonDecor);
    const neonArcs = [];
    const neonRunners = [];
    const addNeonArc = ({ start, end, radiusX, radiusY, depth, color, phase, speed }) => {
      const points = [];
      for (let i = 0; i <= 72; i += 1) {
        const angle = start + ((end - start) * i) / 72;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radiusX,
          Math.sin(angle) * radiusY,
          depth + Math.sin(angle * 2) * 0.18,
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
      const outerGlow = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 108, 0.105, 5, false),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      const halo = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 108, 0.052, 5, false),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.17, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      const core = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 108, 0.012, 5, false),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      neonDecor.add(outerGlow, halo, core);
      neonArcs.push({ outer: outerGlow.material, halo: halo.material, core: core.material, phase });

      const runnerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 10),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xfff0fb, transparent: true, opacity: 0.96, blending: THREE.AdditiveBlending }),
      );
      scene.add(runnerGlow, bead);
      neonRunners.push({ bead, glow: runnerGlow, curve, phase, speed });
    };

    addNeonArc({ start: 0.18, end: Math.PI * 1.45, radiusX: 4.75, radiusY: 3.18, depth: -1.12, color: 0xe64cff, phase: 0.2, speed: 0.035 });
    addNeonArc({ start: Math.PI * 1.16, end: Math.PI * 2.08, radiusX: 4.48, radiusY: 2.94, depth: -0.94, color: 0x63dcff, phase: 1.9, speed: 0.047 });
    addNeonArc({ start: Math.PI * 0.03, end: Math.PI * 0.72, radiusX: 4.22, radiusY: 2.7, depth: -0.75, color: 0xff8cbd, phase: 3.6, speed: 0.04 });

    const cards = [];
    const loader = new THREE.TextureLoader();
    let disposed = false;

    Promise.all(memories.map((memory) => new Promise((resolve) => {
      loader.load(memory.src, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      }, undefined, () => resolve(null));
    }))).then((textures) => {
      if (disposed) {
        textures.forEach((texture) => texture && texture.dispose());
        return;
      }

      textures.forEach((texture, index) => {
        if (!texture) return;
        const memory = memories[index];
        const sourceAspect = texture.image.naturalWidth / texture.image.naturalHeight || 0.7;
        const aspect = memory.rotate ? 1 / sourceAspect : sourceAspect;
        const height = aspect > 1.15 ? 1.7 : 2.25;
        const width = Math.min(1.85, height * aspect);
        const card = new THREE.Group();
        card.userData.index = index;
        card.userData.phase = Math.random() * Math.PI * 2;
        if (memory.rotate) card.rotation.z = memory.rotation ?? -Math.PI / 2;

        const aura = new THREE.Mesh(
          new THREE.PlaneGeometry(width + 0.48, height + 0.6),
          new THREE.MeshBasicMaterial({
            color: index % 2 ? 0xe76fbd : 0xffbb91,
            transparent: true,
            opacity: 0.045,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        aura.position.z = -0.065;
        card.userData.aura = aura.material;
        card.add(aura);

        const frame = new THREE.Mesh(
          new THREE.PlaneGeometry(width + 0.16, height + 0.28),
          new THREE.MeshBasicMaterial({ color: 0xc99ca4 }),
        );
        frame.position.z = -0.02;
        card.add(frame);

        const mat = new THREE.MeshBasicMaterial({ color: 0x160e14 });
        const backing = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.1, height + 0.22), mat);
        backing.position.z = 0.005;
        card.add(backing);

        const photo = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height),
          new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
        );
        photo.position.z = 0.025;
        card.add(photo);

        const glow = new THREE.PointLight(index % 2 ? 0xc8758d : 0xd2a47b, 0.35, 3.5);
        glow.position.set(0, 0, 0.7);
        card.add(glow);
        scene.add(card);
        cards.push(card);
      });
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart = null;
    const down = (event) => { pointerStart = { x: event.clientX, y: event.clientY }; };
    const up = (event) => {
      if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6) {
        pointerStart = null;
        return;
      }
      pointerStart = null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(cards, true)[0];
      if (!hit) return;
      let card = hit.object;
      while (card && card.userData.index === undefined) card = card.parent;
      if (card) onSelectRef.current(card.userData.index);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.fov = window.innerWidth < 600 ? 49 : 42;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const transition = transitionRef.current;
      if (transition && transition.started === null) transition.started = time;
      const transitionProgress = transition
        ? Math.min(1, Math.max(0, (time - transition.started) / 1.12))
        : 1;
      if (transition && transitionProgress >= 1) transitionRef.current = null;

      cards.forEach((card) => {
        const index = card.userData.index;
        const delta = (index - selectedRef.current + memories.length) % memories.length;
        const angle = (delta / memories.length) * Math.PI * 2;
        const focused = index === selectedRef.current;
        let x = focused ? 0 : Math.sin(angle) * 4.05;
        let y = focused ? 0 : Math.sin(angle * 2) * 0.72;
        let z = focused ? 1.9 : -0.35 + Math.cos(angle) * 1.25;
        const float = Math.sin(time * 0.55 + card.userData.phase) * (focused ? 0.045 : 0.1);
        let scale = focused ? 1.15 : 0.77;
        let rotationY = focused ? 0 : -Math.sin(angle) * 0.17;
        let rotationX = focused ? 0 : Math.cos(angle) * 0.035;

        if (transition && transition.started !== null && transitionProgress < 1) {
          const eased = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
          if (index === transition.to) {
            const startDelta = (index - transition.from + memories.length) % memories.length;
            const startAngle = (startDelta / memories.length) * Math.PI * 2;
            const startX = Math.sin(startAngle) * 4.05;
            const startY = Math.sin(startAngle * 2) * 0.72;
            const startZ = -0.35 + Math.cos(startAngle) * 1.25;
            const punchIn = Math.min(1, transitionProgress / 0.58);
            const zoomEase = punchIn * punchIn * (3 - 2 * punchIn);
            const settleIn = Math.max(0, (transitionProgress - 0.58) / 0.42);
            const settleEase = settleIn * settleIn * (3 - 2 * settleIn);
            if (transitionProgress < 0.58) {
              x = startX * (1 - zoomEase);
              y = startY * (1 - zoomEase);
              z = startZ + (3.75 - startZ) * zoomEase;
              scale = 0.77 + (2.02 - 0.77) * zoomEase;
            } else {
              z = 3.75 + (1.9 - 3.75) * settleEase;
              scale = 2.02 + (1.15 - 2.02) * settleEase;
            }
            rotationX *= 1 - zoomEase;
            rotationY *= 1 - zoomEase;
          } else if (index === transition.from) {
            x = -4.3 * eased;
            y = -0.24 * eased;
            z = 1.9 - 3.55 * eased;
            scale = 1.15 - 0.5 * eased;
            rotationY = -0.2 * eased;
          }
        }

        card.position.x += (x - card.position.x) * (transition ? 0.2 : 0.055);
        card.position.y += (y + float - card.position.y) * (transition ? 0.2 : 0.055);
        card.position.z += (z - card.position.z) * (transition ? 0.2 : 0.055);
        card.rotation.y += (rotationY - card.rotation.y) * 0.075;
        card.rotation.x += (rotationX - card.rotation.x) * 0.075;
        card.scale.x += (scale - card.scale.x) * (transition ? 0.2 : 0.055);
        card.scale.y += (scale - card.scale.y) * (transition ? 0.2 : 0.055);
        const glowPulse = reducedMotion ? 0 : Math.sin(time * 2.1 + card.userData.phase) * 0.5 + 0.5;
        card.userData.aura.opacity = focused ? 0.16 + glowPulse * 0.13 : 0.035;
      });
      stars.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.035) * 0.018;
      const motionTime = reducedMotion ? 0 : time;
      const moteAttribute = moteGeometry.getAttribute("position");
      motes.forEach((mote, index) => {
        const offset = index * 3;
        moteAttribute.array[offset] = mote.x + Math.sin(motionTime * 0.24 + mote.phase) * 0.22;
        moteAttribute.array[offset + 1] = ((mote.y + motionTime * mote.speed + 5.5) % 11) - 5.5;
      });
      moteAttribute.needsUpdate = true;
      moteField.material.opacity = reducedMotion ? 0.52 : 0.48 + (Math.sin(time * 0.65) * 0.5 + 0.5) * 0.2;
      neonDecor.rotation.z = reducedMotion ? 0 : Math.sin(time * 0.08) * 0.012;
      neonArcs.forEach((arc) => {
        const pulse = reducedMotion ? 0 : Math.sin(time * 0.7 + arc.phase) * 0.5 + 0.5;
        arc.outer.opacity = 0.025 + pulse * 0.035;
        arc.halo.opacity = 0.11 + pulse * 0.1;
        arc.core.opacity = 0.44 + pulse * 0.34;
      });
      neonRunners.forEach((runner) => {
        const progress = (time * runner.speed + runner.phase) % 1;
        const position = runner.curve.getPointAt(progress);
        runner.bead.position.copy(position);
        runner.glow.position.copy(position);
        runner.glow.scale.setScalar(0.88 + (reducedMotion ? 0 : Math.sin(time * 2.4 + runner.phase) * 0.12));
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      controls.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="orbit-scene" ref={mountRef} aria-label="Interactive 3D photo gallery" />;
}

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
  const audioRef = useRef(null);
  const current = memories[selected];

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(audio.timer);
    audio.oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* Already-ended notes need no cleanup. */ }
    });
    audio.context.close();
  }, []);

  const toggleMusic = async () => {
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
  };

  return (
    <main className="dreamscape-page" id="main-content" tabIndex={-1}>
      <a className="skip-link" href="#memory-picker">Skip to photo controls</a>
      <PhotoOrbit selected={selected} onSelect={setSelected} />
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

      <section className="dreamscape-copy" aria-live="polite">
        <p className="scene-kicker"><span /> an album in orbit</p>
        <h1>A little <em>universe</em><br />of you.</h1>
        <p className="scene-caption">Eight moments, held close<br />and still glowing.</p>
        <div className="memory-label">
          <span className="memory-index">{String(selected + 1).padStart(2, "0")}</span>
          <span className="memory-rule" />
          <span>{current.title}</span>
        </div>
      </section>

      <nav className="memory-picker" id="memory-picker" tabIndex={-1} aria-label="Choose a photograph">
        {memories.map((memory, index) => (
          <button
            className={"memory-dot" + (index === selected ? " is-active" : "")}
            key={memory.src}
            onClick={() => setSelected(index)}
            aria-label={"Show " + memory.title}
            aria-current={index === selected ? "true" : undefined}
          ><span /></button>
        ))}
      </nav>

      <footer className="dreamscape-footer">
        <span className="footer-hint">scroll for a random zoom <i>·</i> drag to wander</span>
        <span className="footer-mark">made with care <b>♡</b></span>
      </footer>

    </main>
  );
}

createRoot(document.getElementById("root")).render(<Dreamscape />);

