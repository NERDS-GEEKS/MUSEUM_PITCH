const INTRO_SEEN_KEY = "navme-intro-seen";

export function hasSeenIntro(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

export function clearIntroSeen(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(INTRO_SEEN_KEY);
  } catch {
    // ignore
  }
}

export { INTRO_SEEN_KEY };
