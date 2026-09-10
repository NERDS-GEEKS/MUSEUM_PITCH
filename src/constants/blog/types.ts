export const BLOG_PATH = "/blog";

export const DEFAULT_BLOG_LINKEDIN_URL =
  "https://www.linkedin.com/company/metadigi-labs-inc/posts/?feedView=all";

export const BLOG_CATEGORIES = [
  "Indoor Navigation",
  "Visual Positioning",
  "Spatial Insights",
  "Product",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  category: BlogCategory;
  /** Resolved Vite asset URL for the card / article cover. */
  coverImage: string;
  linkedinUrl: string;
  blocks: BlogBlock[];
};

export function sortBlogPostsNewestFirst(
  posts: readonly BlogPost[],
): BlogPost[] {
  return [...posts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

export function filterBlogPostsByCategory(
  posts: readonly BlogPost[],
  category: BlogCategory | "All",
): BlogPost[] {
  if (category === "All") return [...posts];
  return posts.filter((post) => post.category === category);
}

export function formatBlogPublishedDate(publishedAt: string): string {
  return new Date(`${publishedAt}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
