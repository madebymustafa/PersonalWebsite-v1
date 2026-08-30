# mustafa.design — Coming Soon

A single-page, no-scroll coming-soon site for mustafa.design: dark editorial
visual language with a cursor-driven image trail, giant letter-spaced type, and
an outlined kinetic marquee.

## Run locally

Serve the folder with any static server:

```bash
python3 -m http.server 8040
# open http://localhost:8040
```

No install, no build step. Deployable as-is to Netlify, Vercel, GitHub Pages, or
a plain server on your parked domain.

## Files

- `index.html` — single viewport: logo, centered heading, trail images, marquee
- `styles.css` — the design system (tokens, layout, responsive breakpoints)
- `main.js` — image trail + kinetic marquee

## Design

- **Colors:** `#202020` background, `#ededed` text — dark, high-contrast editorial
- **Font:** Clash Display (loaded via the Fontshare CDN)
- **Grid:** a faint background-line tile at `opacity: .1` across the viewport
- **Image trail:** a GSAP cursor-chase effect — a centered portrait sits behind
  the heading at load, then joins a cluster of images that ease behind the
  pointer as you move, fading and scaling out as they go
- **Marquee:** outlined `mustafa.design` type that scrolls right → left at the
  bottom
- **Single page:** `body { overflow: hidden }`, one fixed 100vh viewport, no scroll

## Customise

- **Change the marquee text** → edit each `.marquee-text` in `index.html`
- **Change the centered heading** → the `.h-coming-soon` in `index.html`
- **Swap portfolio images** → replace the `src` URLs in `.content` (desktop trail),
  `.main-img`, and `.mobile-content` (mobile stack). Keep them portrait-ish for the trail.
- **Colors** → `:root` tokens in `styles.css` (`--bg`, `--fg`, `--line`)

## Notes

- On touch devices and `prefers-reduced-motion`, the cursor trail is skipped (the
  main centered image shows instead).
- The trail is purely decorative (`pointer-events: none`, images start at `opacity:0`).
