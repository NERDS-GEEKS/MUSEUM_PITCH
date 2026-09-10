import { describe, expect, it } from "vitest";
import {
  getBlogPostBySlug,
  getBlogPostsForCategory,
  getBlogPostsSorted,
} from "@/constants/blog/posts";
import { BLOG_CATEGORIES } from "@/constants/blog/types";

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

  it("filters posts by category", () => {
    const all = getBlogPostsForCategory("All");
    expect(all.length).toBe(getBlogPostsSorted().length);

    for (const category of BLOG_CATEGORIES) {
      const filtered = getBlogPostsForCategory(category);
      expect(filtered.every((post) => post.category === category)).toBe(true);
    }
  });

  it("requires cover image and category on every post", () => {
    for (const post of getBlogPostsSorted()) {
      expect(post.coverImage.length).toBeGreaterThan(0);
      expect(BLOG_CATEGORIES).toContain(post.category);
    }
  });
});
