# Creative direction and implementation research

Research checked on 2026-11-05. Inspiration pages were reviewed for visual direction; blocked pages are identified rather than treated as inspected evidence.

## Five techniques worth adapting

1. **Keep the entry deliberate and audio opt-in.** Active Theory exposes a compact navigation and a clear audio control. Preserve the existing "Tap to begin" / "Enter quietly" choice so the visitor controls when sound and the 3D scene start.
2. **Use one visual focal point at a time.** Keep the selected memory dominant and use the rose/peach glow to guide attention, while the other photos and orbit details stay secondary. This protects the intimate mood from becoming a wall of competing effects.
3. **Let scroll act as a quiet progress cue.** GSAP's ScrollTrigger documentation describes scrubbed and triggered timelines. The letter's existing reading-progress indicator and section reveals provide that pacing without scroll hijacking or another animation dependency.
4. **Adapt graphics to the device budget.** MDN's WebGL guidance recommends conservative GPU budgets and quality options. Keep the 3D module lazy, cap pixel ratio, pause offscreen work, and reduce detail on constrained devices instead of adding a particle framework.
5. **Make every motion-led interaction optional.** WCAG 2.2, `prefers-reduced-motion`, and keyboard-operability guidance support visible focus, native buttons, and a calmer reduced-motion path. These protect the experience for keyboard, screen-reader, and motion-sensitive visitors.

## Inspiration reviewed

- [Awwwards](https://www.awwwards.com/) surfaced its current Site of the Day, Grail, on the research date.
- [Godly](https://godly.website/) redirected to [Recent.design](https://recent.design/?ref=godly), an inspiration index.
- [Active Theory](https://activetheory.net/) loaded and exposed its audio control and compact navigation; its background reel was unavailable in this browsing session.
- [SiteInspire](https://www.siteinspire.com/), [Codrops](https://tympanus.net/codrops/), [Three.js examples](https://threejs.org/examples/), [Lusion](https://lusion.co/), and [Bruno Simon's portfolio](https://bruno-simon.com/) could not be loaded by the available browser/web fetch tools. No site-specific technique is attributed to those pages.

## Library and version check

The project's lockfile pins Three.js `0.149.0`. The upstream Three.js `dev` manifest reported `0.187.0`; the `postprocessing` manifest reported `6.39.6` and a peer range of Three.js `>=0.168.0 <0.188.0`. Therefore, current `postprocessing` is not compatible with the project's pinned Three version without an intentional Three.js upgrade. No postprocessing package or other animation/audio library was added.

Other upstream manifests checked:

| Library | Version reported | License / decision |
| --- | ---: | --- |
| GSAP | 3.15.1 | Its manifest lists a standard no-charge license; not adopted. |
| Lenis | 1.3.27 | MIT; not needed for the existing native scroll experience. |
| Motion | 14.9.1 | MIT; not needed for the existing CSS/DOM animations. |
| Theatre.js | 0.7.0 at the monorepo root | Package-level version not independently checked; not adopted. |
| Tone.js | 15.5.66 | MIT; the existing Web Audio score avoids the extra runtime. |
| tsParticles | 4.5.1 at the monorepo root | No particle package was adopted; small existing Three.js point fields suffice. |
| Fontsource fonts already in the project | 5.3.0 | Existing self-hosted font files have OFL 1.1 license texts in `public/fonts/`. |

These are manifest versions observed in upstream repositories during research, not a recommendation to upgrade. The site already has native CSS motion, Web Audio, and Three.js; adding libraries without a concrete benefit would increase payload and compatibility risk.

## Web and accessibility guidance

- [Core Web Vitals](https://web.dev/articles/vitals): target, at the 75th percentile, LCP ≤2.5 seconds, INP ≤200 milliseconds, and CLS ≤0.1.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): retain keyboard access, focus visibility, semantic controls, and text alternatives.
- [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion): reduce or remove non-essential movement when the user requests it.
- [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices): budget GPU memory conservatively, expose quality fallbacks, and avoid unnecessary rendering.

## Asset and privacy decisions

No external image, audio, texture, HDRI, illustration, or CDN asset was added. Personal photos remain local project files and were hidden in local QA screenshots. Existing font licenses and project artwork are documented in [CREDITS.md](../CREDITS.md).
