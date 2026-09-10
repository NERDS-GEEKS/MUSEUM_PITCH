import { BlogChrome } from "@/components/blog/BlogChrome";
import { getBlogPostBySlug } from "@/constants/blog/posts";
import {
  BLOG_PATH,
  formatBlogPublishedDate,
  type BlogBlock,
} from "@/constants/blog/types";
import { Link, Navigate, useParams } from "react-router-dom";

function BlogBlockView({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="mt-4 text-sm leading-relaxed text-nm-muted sm:text-base">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2 className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-nm-text sm:text-2xl">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-nm-muted sm:text-base">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to={BLOG_PATH} replace />;
  }

  return (
    <BlogChrome active="post">
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="overflow-hidden rounded-2xl border border-nm-border/80">
          <img
            src={post.coverImage}
            alt=""
            className="aspect-[16/9] w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-nm-primary">
          {post.category}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-nm-text sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-nm-muted">
          <time dateTime={post.publishedAt}>
            {formatBlogPublishedDate(post.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <Link
            to={BLOG_PATH}
            className="font-medium text-nm-primary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
          >
            Back to Blog
          </Link>
        </div>
        <p className="mt-5 text-base leading-relaxed text-nm-muted sm:text-lg">
          {post.excerpt}
        </p>

        <article className="mt-8 border-t border-nm-border/80 pt-4">
          {post.blocks.map((block, index) => (
            <BlogBlockView key={`${block.type}-${index}`} block={block} />
          ))}
        </article>

        <div className="mt-10 border-t border-nm-border/80 pt-8">
          <a
            href={post.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-nm-primary/50 bg-nm-primary/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-nm-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-primary"
          >
            View on LinkedIn
          </a>
        </div>
      </main>
    </BlogChrome>
  );
}
