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
    wall: "#E8C88A",
    wallEmissive: "#C47848",
    floor: "#8A6448",
    ceiling: "#C09068",
    light: "#FFF0C8",
    trim: "#B07830",
    frame: "#7A4A28",
    accent: "#E8B830",
    runner: "#B05048",
  },
  vps: {
    kind: "science",
    label: "Science Gallery",
    wall: "#B8E0DA",
    wallEmissive: "#3A8880",
    floor: "#4A7880",
    ceiling: "#68A0A8",
    light: "#E8FFFC",
    trim: "#4A9890",
    frame: "#2A5860",
    accent: "#4AF0E0",
    runner: "#2A8884",
  },
  mapping: {
    kind: "space",
    label: "Space Gallery",
    wall: "#5A6AB0",
    wallEmissive: "#7A98FF",
    floor: "#4A5A88",
    ceiling: "#5A6A98",
    light: "#E0E8FF",
    trim: "#8AA8FF",
    frame: "#2A3858",
    accent: "#9AC8FF",
    runner: "#3A58A0",
  },
  analytics: {
    kind: "art",
    label: "Interactive Technology Gallery",
    wall: "#F7F3EC",
    wallEmissive: "#D07884",
    floor: "#FBF7F0",
    ceiling: "#FFFBF6",
    light: "#FFFFFF",
    trim: "#3A3A36",
    frame: "#2A2A28",
    accent: "#E86878",
    runner: "#F0E4DC",
  },
  industries: {
    kind: "technology",
    label: "Sculptures & Paintings",
    wall: "#D0A058",
    wallEmissive: "#C07028",
    floor: "#7A6240",
    ceiling: "#B09058",
    light: "#FFE8A0",
    trim: "#E09030",
    frame: "#6A4A20",
    accent: "#FFC848",
    runner: "#8A5820",
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
