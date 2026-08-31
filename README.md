# mustafa.design

A single-page coming-soon site for [mustafa.design](https://mustafa.design) — dark,
editorial, with a cursor-driven image trail and an outlined kinetic marquee. No
scroll, no build step, just HTML, CSS, and a little GSAP.

## Run locally

```bash
python3 -m http.server 8040
```

Then open `http://localhost:8040`.

## Structure

```
index.html    one viewport — logo, heading, trail images, marquee
styles.css    design tokens, layout, responsive breakpoints
main.js       image trail + marquee animation
assets/       local images and the background grid
```

## What's inside

- A centered portrait that stays put until you move the cursor, then joins a
  trail of images that chase the pointer, fading and scaling out as they go.
- Custom type via Fontshare (Clash Display) and GSAP from a CDN.
- Images are served locally — no external dependencies for the artwork.

Open the repo on [GitHub](https://github.com/madebymustafa/PersonalWebsite-v1).
