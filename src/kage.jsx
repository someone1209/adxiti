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
  { src: photo2, title: "A playful moment" },
  { src: photo3, title: "In your colors" },
  { src: photo4, title: "Framed with love" },
  { src: photo5, title: "Sunday glow" },
  { src: photo6, title: "That bright smile" },
  { src: photo7, title: "A favorite laugh" },
  { src: photo8, title: "A soft little pause" },
];

function PhotoOrbit({ selected, onSelect }) {
  const mountRef = useRef(null);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
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
    controls.minDistance = 7.5;
    controls.maxDistance = 14;
    controls.minPolarAngle = Math.PI * 0.36;
    controls.maxPolarAngle = Math.PI * 0.64;

    let wheelDelta = 0;
    const onWheel = (event) => {
      wheelDelta += event.deltaY;
      if (Math.abs(wheelDelta) < 72) return;
      const steps = Math.min(4, Math.floor(Math.abs(wheelDelta) / 72));
      const direction = Math.sign(wheelDelta);
      wheelDelta -= direction * steps * 72;
      onSelectRef.current((selectedRef.current + direction * steps + memories.length) % memories.length);
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

    const flashLight = new THREE.PointLight(0xf45aff, 0, 9);
    scene.add(flashLight);
    const lightningBolts = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const makeBolt = (time) => {
      const side = Math.random() < 0.5 ? -1 : 1;
      let x = side * (2.75 + Math.random() * 1.15);
      let y = 2.65 + Math.random() * 0.45;
      const z = 1.65 + Math.random() * 0.9;
      const points = [new THREE.Vector3(x, y, z)];
      for (let i = 0; i < 8; i += 1) {
        x += (Math.random() - 0.5) * 0.62;
        y -= 0.55 + Math.random() * 0.13;
        points.push(new THREE.Vector3(x, y, z + (Math.random() - 0.5) * 0.22));
      }
      const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.12);
      const group = new THREE.Group();
      const materials = [];
      const geometries = [];
      const addTube = (path, color, radius, opacity) => {
        const tubeCurve = new THREE.CatmullRomCurve3(path, false, "catmullrom", 0.08);
        const geometry = new THREE.TubeGeometry(tubeCurve, 24, radius, 5, false);
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        group.add(new THREE.Mesh(geometry, material));
        geometries.push(geometry);
        materials.push(material);
      };

      addTube(curve.getPoints(12), 0xc545ff, 0.065, 0.5);
      addTube(curve.getPoints(12), 0xffd7ff, 0.015, 0.98);
      [3, 5].forEach((at, branchIndex) => {
        const origin = points[at];
        const branch = [
          origin,
          new THREE.Vector3(origin.x + side * (0.28 + branchIndex * 0.08), origin.y - 0.24, z + 0.02),
          new THREE.Vector3(origin.x + side * (0.72 + branchIndex * 0.13), origin.y - 0.53, z - 0.02),
        ];
        addTube(branch, 0x51d9ff, 0.034, 0.7);
        addTube(branch, 0xe8fcff, 0.009, 0.96);
      });

      scene.add(group);
      flashLight.position.copy(points[2]);
      lightningBolts.push({ group, materials, geometries, started: time, duration: 0.5 + Math.random() * 0.28 });
    };

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
        const aspect = texture.image.naturalWidth / texture.image.naturalHeight || 0.7;
        const height = aspect > 1.15 ? 1.7 : 2.25;
        const width = Math.min(1.85, height * aspect);
        const card = new THREE.Group();
        card.userData.index = index;
        card.userData.phase = Math.random() * Math.PI * 2;

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
    let nextBoltAt = 0.8;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      cards.forEach((card) => {
        const index = card.userData.index;
        const delta = (index - selectedRef.current + memories.length) % memories.length;
        const angle = (delta / memories.length) * Math.PI * 2;
        const focused = index === selectedRef.current;
        const x = focused ? 0 : Math.sin(angle) * 4.05;
        const y = focused ? 0 : Math.sin(angle * 2) * 0.72;
        const z = focused ? 1.9 : -0.35 + Math.cos(angle) * 1.25;
        const float = Math.sin(time * 0.55 + card.userData.phase) * (focused ? 0.045 : 0.1);
        const scale = focused ? 1.15 : 0.77;
        card.position.x += (x - card.position.x) * 0.055;
        card.position.y += (y + float - card.position.y) * 0.055;
        card.position.z += (z - card.position.z) * 0.055;
        card.rotation.y += ((focused ? 0 : -Math.sin(angle) * 0.17) - card.rotation.y) * 0.055;
        card.rotation.x += ((focused ? 0 : Math.cos(angle) * 0.035) - card.rotation.x) * 0.055;
        card.scale.x += (scale - card.scale.x) * 0.055;
        card.scale.y += (scale - card.scale.y) * 0.055;
      });
      stars.rotation.y = Math.sin(time * 0.035) * 0.018;
      if (!reducedMotion && time >= nextBoltAt) {
        makeBolt(time);
        if (Math.random() > 0.52) makeBolt(time + 0.035);
        nextBoltAt = time + 1.8 + Math.random() * 1.8;
      }
      let flash = 0;
      for (let i = lightningBolts.length - 1; i >= 0; i -= 1) {
        const bolt = lightningBolts[i];
        const age = time - bolt.started;
        const flicker = age < 0.055 ? 1 : age < 0.095 ? 0.12 : age < 0.17 ? 0.82 : 0.22;
        const fade = Math.max(0, 1 - age / bolt.duration);
        const pulse = flicker * fade;
        bolt.materials.forEach((material, index) => {
          material.opacity = pulse * (index % 2 ? 0.92 : 0.42);
        });
        flash = Math.max(flash, pulse);
        if (age > bolt.duration) {
          scene.remove(bolt.group);
          bolt.geometries.forEach((geometry) => geometry.dispose());
          bolt.materials.forEach((material) => material.dispose());
          lightningBolts.splice(i, 1);
        }
      }
      flashLight.intensity = flash * 24;
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
    <main className="dreamscape-page">
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

      <nav className="memory-picker" aria-label="Choose a photograph">
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
        <span className="footer-hint">scroll or drag to rotate <i>·</i> choose a photograph to bring it close</span>
        <span className="footer-mark">made with care <b>♡</b></span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<Dreamscape />);

