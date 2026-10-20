# Explainer video (50 seconds, 1080 × 1350)

A short film made entirely in code with [Remotion](https://www.remotion.dev) (React), following Remotion's open agent skills (https://github.com/remotion-dev/skills). No footage, no generated images. Every number on screen comes from the model: `scripts/export-data.mjs` runs the published `index.html` headless and writes `src/data.json`, so the film can be rebuilt whenever the model changes.

- `human-necessity-model.mp4` · the rendered film, silent, made for feeds that autoplay without sound
- Fonts: Instrument Serif and IBM Plex (SIL Open Font License), the same as the tool

Rebuild:

```
npm i
node scripts/export-data.mjs ../index.html src/data.json
npx remotion render HumanNecessity out/human-necessity-model.mp4 --codec=h264 --crf=18
```

Remotion is free for individuals and companies of up to three people; see https://www.remotion.dev/license.
