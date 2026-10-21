# The Seal Remains · the film

A 5-minute explainer of the Human Necessity Model, narrated by Carla de Préval and drawn entirely in code.

- **Watch:** [the-seal-remains.mp4](the-seal-remains.mp4) (1080×1350, 5 min 16)
- **Run the model it explains:** https://mommythegeek.github.io/protect-what-thinks/human-necessity-model/

## How it was made

No image or video generator was used. Every frame is drawn on an HTML canvas by the code in [`source/`](source/), and every sound is synthesised or sampled from free libraries.

- **Picture:** a handscroll of twelve prints in a porcelain, cobalt and vermilion palette, built on the ukiyo-e print engine of [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) by Lemomo (MIT); `print.js` and the score recipes are adapted from it. `views.js` draws each print, `figures.js` the people, cranes and props, and `story.js` holds the single timeline every picture, sound and subtitle reads.
- **Voice:** Carla's own narration, recorded on a Plaud device and cut by `slice.py` from the edit list in `carla-v4-edl.json`.
- **Sound:** `mix.py` and `score_lib.py` build the score (physically modelled shamisen, processed CC0 shakuhachi samples, taiko), the foley (seal, paper, scissors, abacus beads) and the mix, ducked under the voice at −14 LUFS.
- **Data:** the 500 futures in the model chapter come from the model itself (`runs.json`, exported by `export-runs.mjs`).
- **Fonts:** Yuji Syuku and Shippori Mincho B1 (SIL Open Font License), via @fontsource.

The rendering engine itself (Lemo-Opuscar's `core/`) is not copied here. Clone it and place this folder under its `films/` directory to render.

Written with Claude (Anthropic).
