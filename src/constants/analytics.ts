/** Kept for archived AnalyticsViz. Prefer BUSINESS_OUTCOMES for live journey copy. */
export const ANALYTICS_STATS = [
  {
    id: "movement",
    label: "Visitor Movement",
    value: "Live",
    hint: "How visitors flow through galleries.",
  },
  {
    id: "explored",
    label: "Most Explored",
    value: "Galleries",
    hint: "Which spaces draw the most attention.",
  },
  {
    id: "dwell",
    label: "Dwell Time",
    value: "Per Exhibit",
    hint: "Where visitors pause and engage.",
  },
  {
    id: "routes",
    label: "Popular Routes",
    value: "Mapped",
    hint: "Floor-to-floor and gallery paths.",
  },
] as const;

/** Museum intelligence metrics for the Insights stop. */
export const BUSINESS_OUTCOMES = [
  {
    id: "movement",
    label: "Visitor Movement",
    value: "Live Paths",
    detail: "How visitors flow through galleries and floors.",
  },
  {
    id: "explored",
    label: "Most Explored Galleries",
    value: "Ranked",
    detail: "Which spaces attract the most attention.",
  },
  {
    id: "dwell",
    label: "Dwell Time",
    value: "Per Exhibit",
    detail: "Where visitors pause, learn, and engage.",
  },
  {
    id: "overlooked",
    label: "Overlooked Exhibits",
    value: "Flagged",
    detail: "Collections visitors might otherwise miss.",
  },
] as const;

export const BUSINESS_IMPROVEMENTS = [
  "Visitor Movement",
  "Most Explored Galleries",
  "Dwell Time",
  "Overlooked Exhibits",
  "Popular Routes",
  "Digital Engagement",
  "Floor-to-Floor Movement",
] as const;
