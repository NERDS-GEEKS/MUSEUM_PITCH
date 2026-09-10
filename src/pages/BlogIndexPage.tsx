import { BlogChrome } from "@/components/blog/BlogChrome";
import {
  getBlogPostsForCategory,
} from "@/constants/blog/posts";
import {
  BLOG_CATEGORIES,
  BLOG_PATH,
  formatBlogPublishedDate,
  type BlogCategory,
  type BlogPost,
} from "@/constants/blog/types";
import { useState } from "react";
import { Link } from "react-router-dom";

type CategoryFilter = BlogCategory | "All";

function PostCover({
  post,
  className,
  sizes,
}: {
  post: BlogPost;
  className?: string;
  sizes?: string;
}) {
  return (
    <img
      src={post.coverImage}
      alt=""
      sizes={sizes}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-nm-border/80 bg-nm-secondary/40 transition-colors hover:border-nm-primary/40">
      <Link
        to={`${BLOG_PATH}/${post.slug}`}
        className="grid gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary md:grid-cols-2"
        aria-label={`Read featured article: ${post.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[280px]">
          <PostCover
            post={post}
            className="absolute inset-0 h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-primary">
            {post.category}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-nm-text sm:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-nm-muted sm:text-base">
            {post.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <time
              dateTime={post.publishedAt}
              className="text-sm text-nm-muted"
            >
              {formatBlogPublishedDate(post.publishedAt)}
            </time>
            <span className="text-sm font-semibold text-nm-primary">
              Read Article →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-nm-border/80 bg-nm-secondary/35 transition-colors hover:border-nm-primary/40">
      <Link
        to={`${BLOG_PATH}/${post.slug}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
        aria-label={`Read article: ${post.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <PostCover
            post={post}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-nm-primary">
            {post.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-nm-text transition-colors group-hover:text-nm-primary sm:text-xl">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-nm-muted">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <time
              dateTime={post.publishedAt}
              className="text-xs text-nm-muted sm:text-sm"
            >
              {formatBlogPublishedDate(post.publishedAt)}
            </time>
            <span className="text-sm font-semibold text-nm-primary">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function BlogIndexPage() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const filtered = getBlogPostsForCategory(category);
  const featured = filtered[0];
  const latest = filtered.slice(1);

  return (
    <BlogChrome active="blog">
      <main className="relative z-10">
        <section
          className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8"
          aria-labelledby="blog-hero-heading"
        >
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-nm-primary/45 bg-nm-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-nm-primary">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-nm-primary" />
            Insights & Ideas
          </p>
          <h1
            id="blog-hero-heading"
            className="mt-5 text-3xl font-semibold tracking-tight text-nm-text sm:text-5xl"
          >
            Exploring the Future of{" "}
            <span className="text-nm-primary">Indoor Navigation</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-nm-muted sm:text-base">
            Explore insights on AR wayfinding, visual positioning, and spatial
            experiences that help people move through complex buildings without
            an app. Drawn from MetaDigi Labs updates on LinkedIn.
          </p>
        </section>

        <div
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 pb-10 sm:px-6 lg:px-8"
          role="group"
          aria-label="Filter posts by category"
        >
          {(["All", ...BLOG_CATEGORIES] as const).map((item) => {
            const selected = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(item)}
                className={
                  selected
                    ? "rounded-full border border-nm-primary bg-nm-primary/15 px-3.5 py-1.5 text-xs font-semibold text-nm-primary sm:text-sm"
                    : "rounded-full border border-white/20 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-[#C8D6EC] transition-colors hover:border-white/40 hover:text-white sm:text-sm"
                }
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 sm:px-6 lg:px-8">
          {featured ? (
            <section aria-label="Featured article">
              <FeaturedPost post={featured} />
            </section>
          ) : null}

          {latest.length > 0 ? (
            <section aria-labelledby="latest-articles-heading">
              <h2
                id="latest-articles-heading"
                className="text-2xl font-semibold tracking-tight text-nm-text sm:text-3xl"
              >
                Latest Articles
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {!featured ? (
            <section className="rounded-2xl border border-nm-border/80 bg-nm-secondary/30 px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-nm-text">
                No articles in this category yet
              </h2>
              <p className="mt-2 text-sm text-nm-muted">
                Try another category, or view all insights.
              </p>
              <button
                type="button"
                onClick={() => setCategory("All")}
                className="mt-6 rounded-full border border-nm-primary/50 bg-nm-primary/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-nm-primary"
              >
                View all
              </button>
            </section>
          ) : null}
        </div>
      </main>
    </BlogChrome>
  );
}
