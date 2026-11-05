# Credits and asset notes

## Fonts

The site self-hosts these Latin variable WOFF2 files from Fontsource. Each typeface is licensed under the SIL Open Font License 1.1; the package license text is included beside the files.

- **DM Sans** — Fontsource package `@fontsource-variable/dm-sans` 5.3.0; `public/fonts/dm-sans-latin-wght-normal.woff2`. [Package](https://www.npmjs.com/package/@fontsource-variable/dm-sans/v/5.3.0) · [OFL 1.1](https://openfontlicense.org/)
- **Playfair Display** — Fontsource package `@fontsource-variable/playfair-display` 5.3.0; normal and italic Latin WOFF2 files in `public/fonts/`. [Package](https://www.npmjs.com/package/@fontsource-variable/playfair-display/v/5.3.0) · [OFL 1.1](https://openfontlicense.org/)
- **Caveat** — Fontsource package `@fontsource-variable/caveat` 5.3.0; `public/fonts/caveat-latin-wght-normal.woff2`. [Package](https://www.npmjs.com/package/@fontsource-variable/caveat/v/5.3.0) · [OFL 1.1](https://openfontlicense.org/)

## Photos and sound

- The eight images in `images/photo1.jpg` through `images/photo8.jpg` were supplied with this personal project. They remain local project assets and are not sent to a third-party image, AI, or CDN service.
- The 3D gallery downsamples photo textures to a 1024-pixel maximum edge in a browser canvas at runtime to reduce GPU memory. The original files remain unchanged and no derivative photo files are added to the repository.
- The ambient score is synthesized in `src/kage.jsx` with the browser Web Audio API. The project uses no downloaded music or sound recording.

## Original project artwork

- `public/og-preview.svg` and `public/og-preview.png` are original artwork made for this site; the social preview contains no personal photos.
- `public/favicon.svg` and the CSS gradients, neon orbit, dust and star effects are project artwork; no third-party illustration, texture, or HDRI is used.

## Removed from active styling

- `images/romantic-backdrop.jpg` had no source or license record in the repository. It is kept unchanged but is no longer referenced by either page; the site now uses code-authored gradients in its place.
