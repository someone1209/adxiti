# Preview evidence

All screenshots below were captured locally in Chrome at the listed CSS viewport sizes. Personal photo pixels are deliberately hidden in every image; no original or derived personal photo is included in these previews. Full unredacted visual QA screenshots remain local only.

## Before / after

### Letter page — 375 px

![Before, letter page at 375px](before-letter-375.png) ![After, letter page at 375px](after-letter-375.png)

### Letter page — 1440 px

![Before, letter page at 1440px](before-letter-1440.png) ![After, letter page at 1440px](after-letter-1440.png)

### 3D gallery — 375 px

![Before, gallery at 375px](before-kage-375.png) ![After, gallery at 375px](after-kage-375.png)

### 3D gallery — 1440 px

![Before, gallery at 1440px](before-kage-1440.png) ![After, gallery at 1440px](after-kage-1440.png)

## Next-level responsive captures

These local production-preview screenshots were captured after the shared-memory-data change. Personal photo pixels and the 3D canvas were hidden at capture time; the original photos were not sent to any external service.

### Letter

![Letter page at 375px](next-level-letter-375.png)
![Letter page at 768px](next-level-letter-768.png)
![Letter page at 1440px](next-level-letter-1440.png)

### A Little Universe of You

![Gallery page at 375px](next-level-kage-375.png)
![Gallery page at 768px](next-level-kage-768.png)
![Gallery page at 1440px](next-level-kage-1440.png)

## Lighthouse mobile (local production preview)

Most recently recorded Lighthouse mobile run before the next-level content change, using simulated throttling:

| Page | Performance | Accessibility | Best Practices | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Letter | 89 | 100 | 100 | 3.2 s | 0 | 0 ms |
| A Little Universe of You | 96 | 100 | 96 | 2.2 s | 0 | 30 ms |

Scores are Lighthouse lab results from a local production preview, not field Core Web Vitals. The letter page meets the requested 85+ Performance threshold; measured LCP is still above the 2.5 s field target in this simulated run. The content change added a small shared metadata module; Lighthouse has not yet been rerun for that change.

## Responsive and browser checks

Production preview checked at 320, 375, 390, 768 and 1440 px on both routes:

- No horizontal overflow or browser console/page errors.
- No external network requests; local fonts load, and `noindex, nofollow` remains on both pages.
- 3D canvas and scene chunk are absent until the user enters; mobile swipe advances the selected memory.
- The gallery resizes source textures locally in a browser canvas and adapts renderer pixel ratio based on observed frame rate.

## Things to fill in when ready

- Optional date and one-line note for each of the eight memories in `src/memories.js`.
- Preferred music direction if you want the synthesized Web Audio ambience changed.
- Optional social preview artwork if you want a different photo-free image; current Open Graph preview avoids personal images.