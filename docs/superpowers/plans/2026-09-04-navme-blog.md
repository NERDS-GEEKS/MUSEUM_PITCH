# NavMe Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a curated Blog at `/blog` and `/blog/:slug` with sample NavMe posts, footer discovery, LinkedIn CTA, and Hostinger-safe SPA shells.

**Architecture:** Static TypeScript post modules in `src/constants/blog/`, React Router pages matching the dark LegalDocumentPage chrome, footer Quick Links entry that navigates to `/blog`, and `postbuild` copy of `index.html` into `dist/blog/index.html` (plus `blog.html`).

**Tech Stack:** React 19, React Router 7, TypeScript, Vite, Vitest, Tailwind v4 (existing NavMe tokens).

## Global Constraints

- No LinkedIn scraping or live sync.
- Dark NavMe theme (`nm-bg`, `nm-text`, `nm-muted`, `nm-border`, `nm-primary`) like Privacy/Terms.
- Full article body on-site; LinkedIn opens in a new tab with `noopener,noreferrer`.
- Unknown slug redirects to `/blog` (no white screen).
- Default LinkedIn URL: `https://www.linkedin.com/company/metadigi-labs-inc/posts/?feedView=all`
- Exhaustive `switch` on `BlogBlock` with `never` default.
- No new CMS, RSS, comments, or card-heavy marketing layout.

## File map

| File | Responsibility |
|------|----------------|
| `src/constants/blog/types.ts` | `BLOG_PATH`, `BlogBlock`, `BlogPost`, helpers |
| `src/constants/blog/posts.ts` | Four sample posts + `BLOG_POSTS` array |
| `src/constants/blog/posts.test.ts` | Slug lookup + sort tests |
| `src/pages/BlogIndexPage.tsx` | `/blog` list UI |
| `src/pages/BlogPostPage.tsx` | `/blog/:slug` article UI |
| `src/App.tsx` | Routes for index + post |
| `src/constants/footer.ts` | Quick Links “Blog” entry |
| `src/journey/world/EndWallFooter.tsx` | Navigate `/blog` (already supports `/` paths via openFooterLink) |
| `src/components/layout/Footer.tsx` | Blog link in legal/footer row |
| `scripts/verify-dist.mjs` | SPA shells for blog |
| `docs/superpowers/specs/2026-09-04-navme-blog-design.md` | Mark status Approved |

---

### Task 1: Blog types + helpers + failing tests

**Files:**
- Create: `src/constants/blog/types.ts`
- Create: `src/constants/blog/posts.ts` (minimal stub export so tests compile against API)
- Create: `src/constants/blog/posts.test.ts`

**Interfaces:**
- Produces:
  - `BLOG_PATH = "/blog"`
  - `BLOG_URL = "/blog/"`
  - `DEFAULT_BLOG_LINKEDIN_URL` (company posts feed)
  - `BlogBlock`, `BlogPost`
  - `getBlogPostsSorted(): BlogPost[]` — newest first by `publishedAt`
  - `getBlogPostBySlug(slug: string): BlogPost | undefined`

- [ ] **Step 1: Write failing tests**

```ts
// src/constants/blog/posts.test.ts
import { describe, expect, it } from "vitest";
import {
  getBlogPostBySlug,
  getBlogPostsSorted,
} from "@/constants/blog/posts";

describe("blog posts", () => {
  it("returns posts sorted by publishedAt descending", () => {
    const posts = getBlogPostsSorted();
    expect(posts.length).toBeGreaterThanOrEqual(4);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].publishedAt >= posts[i].publishedAt).toBe(true);
    }
  });

  it("resolves a known slug", () => {
    const first = getBlogPostsSorted()[0];
    expect(getBlogPostBySlug(first.slug)?.title).toBe(first.title);
  });

  it("returns undefined for unknown slug", () => {
    expect(getBlogPostBySlug("does-not-exist")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL** (module/helpers missing or empty)

```bash
npm test -- src/constants/blog/posts.test.ts
```

- [ ] **Step 3: Implement types + stub posts file with helpers**

```ts
// src/constants/blog/types.ts
export const BLOG_PATH = "/blog";
export const BLOG_URL = "/blog/";

export const DEFAULT_BLOG_LINKEDIN_URL =
  "https://www.linkedin.com/company/metadigi-labs-inc/posts/?feedView=all";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  linkedinUrl: string;
  blocks: BlogBlock[];
};

export function sortBlogPostsNewestFirst(posts: readonly BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}
```

In `posts.ts`, export `BLOG_POSTS` as empty array temporarily and:

```ts
export function getBlogPostsSorted() {
  return sortBlogPostsNewestFirst(BLOG_POSTS);
}
export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
```

Then fill `BLOG_POSTS` with **four** sample posts (titles from spec), each with `excerpt`, several `p` / optional `h2` blocks, and `linkedinUrl: DEFAULT_BLOG_LINKEDIN_URL`. Use distinct ISO dates e.g. `2026-08-01` … `2026-08-28`.

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- src/constants/blog/posts.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/constants/blog/types.ts src/constants/blog/posts.ts src/constants/blog/posts.test.ts
git commit -m "Add blog post content model and sample posts."
```

---

### Task 2: Blog index + article pages

**Files:**
- Create: `src/pages/BlogIndexPage.tsx`
- Create: `src/pages/BlogPostPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `BLOG_PATH`, `getBlogPostsSorted`, `getBlogPostBySlug`, `BlogPost`, `BlogBlock`
- Produces: routed pages at `/blog` and `/blog/:slug`

- [ ] **Step 1: Implement `BlogIndexPage`**

Match legal page chrome (logo header, dark bg). List posts from `getBlogPostsSorted()`; each row/link to `${BLOG_PATH}/${post.slug}` showing title, formatted date, excerpt, “Read more”. Header nav: Blog (current), Back to NavMe → `/`.

Date display example: `new Date(post.publishedAt + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })`.

- [ ] **Step 2: Implement `BlogPostPage`**

```tsx
// Outline
const { slug } = useParams();
const post = slug ? getBlogPostBySlug(slug) : undefined;
if (!post) return <Navigate to={BLOG_PATH} replace />;
// header: Link to BLOG_PATH "All posts", Link to "/" "Back to NavMe"
// h1 title, date, map blocks with exhaustive switch
// <a href={post.linkedinUrl} target="_blank" rel="noopener noreferrer">View on LinkedIn</a>
```

Block renderer: `p` / `h2` / `ul` / `default: never`.

- [ ] **Step 3: Wire routes in `App.tsx`**

```tsx
import { BlogIndexPage } from "@/pages/BlogIndexPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { BLOG_PATH } from "@/constants/blog/types";

// inside <Routes>:
<Route path={BLOG_PATH} element={<BlogIndexPage />} />
<Route path={`${BLOG_PATH}/:slug`} element={<BlogPostPage />} />
```

Keep existing privacy/terms and `*` → `/` catch-all **after** blog routes.

- [ ] **Step 4: Smoke via Vitest or manual `npm run dev`**

Open `/blog` and one slug; unknown slug redirects to `/blog`.

Optional tiny test with MemoryRouter if quick; otherwise manual is enough for this task.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogIndexPage.tsx src/pages/BlogPostPage.tsx src/App.tsx
git commit -m "Add Blog index and article routes."
```

---

### Task 3: Footer discovery + SPA hosting shells

**Files:**
- Modify: `src/constants/footer.ts` — add Quick Links Blog
- Modify: `src/components/layout/Footer.tsx` — Blog link near legal
- Modify: `src/journey/world/EndWallFooter.tsx` only if `/blog` needs special-case (prefer using `href: "/blog"` without `journeyId` so `openFooterLink` opens/navigates; **prefer `navigate('/blog')` for same-tab SPA** — extend `openFooterLink` to treat paths starting with `/blog` like legal paths: `navigate(href)` without `requestReturnToFinish`)
- Modify: `scripts/verify-dist.mjs` — add blog shells
- Modify: `docs/superpowers/specs/2026-09-04-navme-blog-design.md` — Status: Approved

**Interfaces:**
- Consumes: `BLOG_PATH` / `BLOG_URL`
- Footer Quick Link: `{ label: "Blog", href: "/blog" }` (no `journeyId`)

- [ ] **Step 1: Extend `openFooterLink` in EndWallFooter**

After legalPath check, add:

```ts
if (href === "/blog" || href.startsWith("/blog/")) {
  navigate(href);
  return;
}
```

So mural footer Blog stays in-app (same tab), not `window.open`.

- [ ] **Step 2: Add Quick Links entry**

In `FOOTER_COLUMNS` Quick Links, after Contact or before Contact:

```ts
{ label: "Blog", href: "/blog" },
```

- [ ] **Step 3: HTML Footer legal row**

Add `<Link to={BLOG_PATH}>Blog</Link>` beside Privacy/Terms (import `BLOG_PATH`).

- [ ] **Step 4: SPA shells**

In `verify-dist.mjs` `spaShellCopies`, add:

```js
path.join("dist", "blog.html"),
path.join("dist", "blog", "index.html"),
```

- [ ] **Step 5: Build verify**

```bash
npm run build
```

Expect log line includes `blog/index.html`. Confirm `dist/blog/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add src/constants/footer.ts src/components/layout/Footer.tsx src/journey/world/EndWallFooter.tsx scripts/verify-dist.mjs docs/superpowers/specs/2026-09-04-navme-blog-design.md
git commit -m "Wire Blog into footers and static hosting shells."
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| `/blog` + `/blog/:slug` | 2 |
| Dark legal-like UI | 2 |
| Sample 4 posts + LinkedIn CTA | 1, 2 |
| Footer Quick Links + HTML footer | 3 |
| SPA shell Hostinger | 3 |
| Slug helpers + sort tests | 1 |
| Unknown slug → `/blog` | 2 |
| No live LinkedIn sync | all (by omission) |

## Placeholder scan

None intentional; sample post body copy is written in Task 1 Step 3 (implementer writes full paragraphs in `posts.ts`, not “TBD”).
