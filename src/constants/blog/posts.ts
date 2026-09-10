import coverAnalytics from "@/assets/logo.png";
import coverAr from "@/assets/logo.png";
import coverGpsFails from "@/assets/wayfinding-reference.png";
import coverVps from "@/assets/wayfinding-reference.png";
import {
  DEFAULT_BLOG_LINKEDIN_URL,
  filterBlogPostsByCategory,
  sortBlogPostsNewestFirst,
  type BlogCategory,
  type BlogPost,
} from "./types";

export { DEFAULT_BLOG_LINKEDIN_URL } from "./types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "no-app-indoor-navigation-scan-and-go",
    title: "No-app indoor navigation: scan and go",
    publishedAt: "2026-08-28",
    category: "Product",
    coverImage: coverAr,
    excerpt:
      "Visitors should not need an app store detour to find their way. NavMe keeps indoor navigation in the browser with a simple QR scan.",
    linkedinUrl: DEFAULT_BLOG_LINKEDIN_URL,
    blocks: [
      {
        type: "p",
        text: "Every extra step between a visitor and their destination is friction. Downloading an app, creating an account, or granting permissions before they can ask for directions often means they never start the journey at all.",
      },
      {
        type: "p",
        text: "NavMe is built around scan-and-go. A QR code at an entrance or kiosk opens a browser-based session—no install, no store listing, no onboarding flow. The visitor picks a destination and follows AR directions using the camera they already carry.",
      },
      {
        type: "h2",
        text: "Why browser-first matters",
      },
      {
        type: "p",
        text: "Museum visitors, school groups, and tourists arrive with different devices and comfort levels. A web session works across iOS and Android without venue IT managing another native app release cycle.",
      },
      {
        type: "ul",
        items: [
          "Lower barrier at the door: scan, choose destination, navigate",
          "Easier rollout for curators—update exhibits without app review delays",
          "Consistent experience whether the visitor is a first-timer or a regular",
        ],
      },
      {
        type: "p",
        text: "For organizations deploying NavMe, that simplicity translates into higher adoption and fewer support calls asking where to download something. The navigation experience stays focused on getting people where they need to go.",
      },
    ],
  },
  {
    slug: "what-organizations-gain-from-spatial-insights",
    title: "What organizations gain from spatial insights",
    publishedAt: "2026-08-21",
    category: "Spatial Insights",
    coverImage: coverAnalytics,
    excerpt:
      "Wayfinding generates more than turn-by-turn directions. Aggregate movement patterns help venues improve layout, staffing, and visitor flow.",
    linkedinUrl: DEFAULT_BLOG_LINKEDIN_URL,
    blocks: [
      {
        type: "p",
        text: "Indoor navigation is often treated as a convenience feature—help visitors find Space Gallery or the nearest facility. That is essential, but the same spatial infrastructure can surface patterns museum directors rarely see from floor plans alone.",
      },
      {
        type: "h2",
        text: "From sessions to actionable insight",
      },
      {
        type: "p",
        text: "When visitors search for destinations and follow routes, NavMe can aggregate those flows in anonymized form. Popular paths, peak congestion windows, and frequently missed turns become signals for signage updates, staffing, or layout changes.",
      },
      {
        type: "ul",
        items: [
          "Identify bottlenecks before they become recurring complaints",
          "Validate whether new signage or relocated services actually improve flow",
          "Support operational planning with evidence instead of guesswork",
        ],
      },
      {
        type: "p",
        text: "MetaDigi Labs builds NavMe with museum directors in mind: navigation for the visitor, spatial insight for the institution. Privacy remains central—aggregated analytics by default, with clear boundaries when a customer configures deeper retention for their own operational needs.",
      },
    ],
  },
  {
    slug: "how-visual-positioning-helps-visitors-in-large-buildings",
    title: "How visual positioning helps visitors in large buildings",
    publishedAt: "2026-08-14",
    category: "Visual Positioning",
    coverImage: coverVps,
    excerpt:
      "Camera-based visual positioning anchors AR directions inside complex campuses where GPS and generic maps fall short.",
    linkedinUrl: DEFAULT_BLOG_LINKEDIN_URL,
    blocks: [
      {
        type: "p",
        text: "Large buildings share a problem: the map on your phone stops being useful the moment you step inside. GPS fades, Wi-Fi fingerprints drift, and static floor plans do not tell you which hallway you are actually standing in.",
      },
      {
        type: "h2",
        text: "Seeing the space, not guessing it",
      },
      {
        type: "p",
        text: "Visual positioning uses the device camera to recognize features in the environment—doorways, signage, structural elements—and align the visitor within a digital model of the venue. NavMe renders AR arrows and labels that stay tied to real-world geometry as people move.",
      },
      {
        type: "p",
        text: "That matters in museums with repeating halls, stacked galleries, and temporary exhibitions that reconfigure traffic. Visitors get continuous guidance instead of paper maps and missed collections.",
      },
      {
        type: "ul",
        items: [
          "Stable AR overlays that track movement through turns and level changes",
          "Localization that works where satellite signals cannot",
          "An experience that feels grounded in the space you are actually in",
        ],
      },
    ],
  },
  {
    slug: "why-indoor-wayfinding-needs-more-than-gps",
    title: "Why indoor wayfinding needs more than GPS",
    publishedAt: "2026-08-01",
    category: "Indoor Navigation",
    coverImage: coverGpsFails,
    excerpt:
      "Outdoor navigation set expectations, but indoor spaces need purpose-built positioning, clear destinations, and experiences that work without an app install.",
    linkedinUrl: DEFAULT_BLOG_LINKEDIN_URL,
    blocks: [
      {
        type: "p",
        text: "We are trained by years of turn-by-turn driving apps to expect blue dots and voice prompts everywhere we go. Indoors, that mental model breaks quickly. Thick walls, multi-floor stacks, and dense infrastructure block or distort the signals those apps rely on.",
      },
      {
        type: "h2",
        text: "Different environment, different tools",
      },
      {
        type: "p",
        text: "Effective indoor wayfinding combines accurate positioning with venue-specific content: which elevator serves which wing, where registration moved for today's event, which entrance is accessible after hours. Generic map tiles cannot encode that operational detail.",
      },
      {
        type: "p",
        text: "NavMe addresses the full stack—browser-based sessions, a Digital Twin for AR guidance, and dashboards for curators to keep exhibits current. GPS got visitors to the building; museum exploration gets them to the right gallery without frustration.",
      },
      {
        type: "ul",
        items: [
          "GPS alone cannot resolve floor level or corridor identity",
          "Visitors need current venue data, not a static external map",
          "No-app access removes a common drop-off point before navigation even starts",
        ],
      },
    ],
  },
];

export function getBlogPostsSorted(): BlogPost[] {
  return sortBlogPostsNewestFirst(BLOG_POSTS);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsForCategory(
  category: BlogCategory | "All",
): BlogPost[] {
  return filterBlogPostsByCategory(getBlogPostsSorted(), category);
}
