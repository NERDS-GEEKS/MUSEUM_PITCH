# NavMe Blog (LinkedIn-curated) Design

**Date:** 2026-09-04  
**Status:** Approved  
**Related:** [MetaDigi Labs LinkedIn posts](https://www.linkedin.com/company/metadigi-labs-inc/posts/?feedView=all)

## Problem

NavMe should surface company thought leadership as a first-class Blog on `navme.space`. LinkedIn does not provide a free public API/feed for company posts suitable for live scraping, so posts must be curated on-site and optionally linked back to LinkedIn.

## Goals

- Ship `/blog` (index) and `/blog/:slug` (full article) with dark NavMe branding consistent with Privacy/Terms.
- Discoverability from the journey finish-wall footer Quick Links and the HTML footer.
- Start with 3–4 sample NavMe / indoor-navigation posts that editors can replace with real LinkedIn content later.
- Each article is readable in full on NavMe, with a “View on LinkedIn” CTA.

## Non-goals

- Live auto-sync or scraping of LinkedIn.
- CMS / admin UI for non-developers (can be a later phase).
- Comments, tags taxonomy, or search.

## Approach (chosen)

**Static TypeScript content modules** (same pattern family as `src/constants/legal/*`):

- Post metadata + body blocks in `src/constants/blog/`.
- React Router pages for index + article.
- SPA static shells in `postbuild` so Hostinger/Apache serve `/blog` without 404.

## Information architecture

| Path | Purpose |
|------|---------|
| `/blog` | Card/list of posts (title, date, excerpt, Read more) |
| `/blog/:slug` | Full article (title, date, body, View on LinkedIn, Back to Blog, Back to NavMe) |
| Footer Quick Links | “Blog” → `/blog` via client navigate (same restore-finish pattern optional; prefer navigate to `/blog` without forcing finish wall) |
| HTML `Footer` (if used) | Link to `/blog` |

LinkedIn URL default for posts: company posts feed  
`https://www.linkedin.com/company/metadigi-labs-inc/posts/?feedView=all`  
(or a specific post URL when known).

## Content model

```ts
type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

type BlogPost = {
  slug: string;           // URL segment, kebab-case
  title: string;
  publishedAt: string;    // ISO date YYYY-MM-DD for sort/display
  excerpt: string;        // card blurb
  linkedinUrl: string;    // external CTA
  blocks: BlogBlock[];    // article body
};
```

- Index sorts by `publishedAt` descending.
- Unknown slug → redirect to `/blog` (or soft “not found” with link back).

## UI / visual

- Match `LegalDocumentPage` shell: dark `nm-bg`, logo header, restrained borders, readable max-width (~`max-w-3xl`).
- Index: simple stacked or 1–2 column list of posts — not a marketing card grid with shadows; keep editorial and calm.
- Article: typography consistent with legal pages; primary CTA button/link for LinkedIn opens in new tab (`noopener,noreferrer`).
- Mobile: same layout, comfortable tap targets, no overlapping chrome.

## Routing & hosting

- Add routes in `App.tsx` beside privacy/terms.
- Extend `scripts/verify-dist.mjs` to copy SPA shell to `dist/blog/index.html` (directory URL). Per-slug shells optional if Hostinger rewrite + `.htaccess` already fall back to `index.html`; prefer relying on existing SPA rewrite + `/blog/` directory shell for the index.
- Browser back from blog should return to previous history entry; “Back to NavMe” → `/`. Optional: do **not** force finish-wall restore unless user came from footer legal flow (keep Blog navigation simple).

## Sample posts (scaffold)

Four placeholder articles themed around indoor navigation / NavMe / MetaDigi Labs voice, clearly replaceable. Titles examples (final copy can vary slightly in implementation):

1. Why indoor wayfinding needs more than GPS  
2. How visual positioning helps visitors in large buildings  
3. What organizations gain from spatial insights  
4. No-app indoor navigation: scan and go  

Each includes a short body (several paragraphs) and the shared LinkedIn company posts URL until real per-post URLs are supplied.

## Testing

- Unit: helper that resolves post by slug; index sort order.
- Manual: `/blog`, open a slug, LinkedIn opens externally, footer Blog link works, production build includes `blog/index.html` shell.
- Ensure unknown slug does not white-screen.

## Out of scope for v1

- RSS feed, author pages, categories, CMS, image hero per post (optional later), automated LinkedIn import.

## Success criteria

- Visitor can open Blog from footer Quick Links and from `/blog` URL.
- Visitor can read a full sample article on-site and open LinkedIn.
- Static hosting does not show Hostinger 404 for `/blog`.
- Adding a post is a matter of appending one entry in constants (and optional SPA shell if ever needed for deep links without rewrite).
