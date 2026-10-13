# A Rose That Never Wilts

A private, mobile-first gift experience built with plain HTML, CSS and vanilla JavaScript. No build step or server is required.

## Preview

Open index.html in a browser, or run python3 -m http.server 8000 from this folder and visit http://localhost:8000.

## Tune the bouquet

Edit the BLOOM object at the top of scripts/main.js:

- bouquetCount: number of roses (default 100)
- petals: number of outer petals; two smaller layers are generated automatically
- staggerMs: timing between each petal's unfurl
- colors and edge: rose petal colors and outline

The makeRose function builds every bloom from the same parameterized SVG generator. Each flower receives small variations in position, angle and animation timing.

## Change the words

Edit the initial and reveal lines in scripts/main.js. The closing paragraph and Kamran signature are in the line.innerHTML assignment near the end of the file.

## Private sharing

Host the files on a private or unlisted static host with access controls, then send the protected link directly. The noindex tag discourages search indexing but does not restrict access; use password or invite-only protection for actual privacy. For an in-person handoff, open index.html on your phone.

## Motion

The page honors prefers-reduced-motion while preserving the unwrap, single rose, bouquet and closing sequence. SVG petals animate with staggered transforms; short-lived CSS particles add sparkles and drifting petals. Device-specific performance can vary.
