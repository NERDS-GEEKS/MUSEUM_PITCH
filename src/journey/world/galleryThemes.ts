import { MUSEUM } from "@/journey/theme/museumPalette";

export type GalleryKind =
  | "lobby"
  | "history"
  | "science"
  | "space"
  | "art"
  | "technology"
  | "future";

export type GalleryTheme = {
  kind: GalleryKind;
  label: string;
  wall: string;
  wallEmissive: string;
  floor: string;
  ceiling: string;
  light: string;
  trim: string;
  frame: string;
  accent: string;
  runner: string;
};

const LOBBY: GalleryTheme = {
  kind: "lobby",
  label: "Grand Hall",
  wall: MUSEUM.wall,
  wallEmissive: MUSEUM.wallEmissive,
  floor: MUSEUM.floor,
  ceiling: MUSEUM.ceiling,
  light: MUSEUM.lightPanel,
  trim: MUSEUM.trim,
  frame: MUSEUM.frame,
  accent: MUSEUM.primary,
  runner: MUSEUM.runner,
};

const THEMES_BY_ROOM: Record<string, GalleryTheme> = {
  welcome: {
    ...LOBBY,
    label: "Museum Entrance",
  },
  "gps-fails": {
    kind: "history",
    label: "History Gallery",
    wall: "#4A3C32",
    wallEmissive: "#6A5040",
    floor: "#26201A",
    ceiling: "#2A241E",
    light: "#E4D0A8",
    trim: "#8A6A48",
    frame: "#3A2A20",
    accent: "#C4A060",
    runner: "#4A2824",
  },
  vps: {
    kind: "science",
    label: "Science Gallery",
    wall: "#354244",
    wallEmissive: "#3A5858",
    floor: "#1E2628",
    ceiling: "#222A2C",
    light: "#D0E0DE",
    trim: "#5A7A78",
    frame: "#1E2A2C",
    accent: "#5AA8A0",
    runner: "#1E3A38",
  },
  mapping: {
    kind: "space",
    label: "Space Gallery",
    wall: "#2E3548",
    wallEmissive: "#3A4A68",
    floor: "#1A1E28",
    ceiling: "#1E2430",
    light: "#D0D6E4",
    trim: "#6A7A98",
    frame: "#161C28",
    accent: "#7A98C8",
    runner: "#1A2848",
  },
  analytics: {
    kind: "art",
    label: "Interactive Technology Gallery",
    wall: "#3E3A38",
    wallEmissive: "#5A4848",
    floor: "#24201E",
    ceiling: "#262220",
    light: "#E8DCD4",
    trim: "#6A5854",
    frame: "#1E1C1A",
    accent: "#C07078",
    runner: "#3A2828",
  },
  industries: {
    kind: "technology",
    label: "Sculptures & Paintings",
    wall: "#453A2E",
    wallEmissive: "#5A4830",
    floor: "#262018",
    ceiling: "#2A241C",
    light: "#E4D0A0",
    trim: "#8A6840",
    frame: "#2A2218",
    accent: "#C49850",
    runner: "#3A2818",
  },
  complete: {
    ...LOBBY,
    kind: "future",
    label: "The Future Museum",
  },
};

export function getGalleryTheme(roomId: string): GalleryTheme {
  return THEMES_BY_ROOM[roomId] ?? LOBBY;
}
