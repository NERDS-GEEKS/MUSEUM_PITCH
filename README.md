# NavMe — Pitch.Museum.Space

React + TypeScript + Vite + Three.js museum pitch journey (7 slides across 3 floors).

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
```

Output is in `dist/` (includes `index.html` + `assets/`).

## Journey floors

| Floor | Slides |
| --- | --- |
| Ground | Museum · Problem |
| First | Twin · Navigate · Insights |
| Second | Convert · Future |

## Render static site (required settings)

Create **Static Site** (not Web Service) and set:

| Setting | Value |
| --- | --- |
| Build command | `npm install && npm run build` |
| **Publish directory** | `dist` |

If Publish directory is empty, `.`, or `build`, you will get `/assets/*.js` **404** errors.

After deploy: hard-refresh the site (Cmd+Shift+R). A mid-deploy refresh can briefly 404 old hashed asset names.

Optional: Redirects/Rewrites → Source `/*` → Destination `/index.html` → **Rewrite**.
