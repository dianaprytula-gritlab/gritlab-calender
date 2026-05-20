export type CategoryKey =
  | "raid"
  | "checkpoint"
  | "explore"
  | "play"
  | "lab"
  | "checkin"
  | "fika"
  | "hackathon"
  | "audits"
  | "exit";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  emoji: string;
  tone: string; // tailwind-ish token name we map to CSS vars
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  raid: { key: "raid", label: "Raid", emoji: "⚔️", tone: "raid" },
  checkpoint: { key: "checkpoint", label: "Checkpoint", emoji: "🎯", tone: "checkpoint" },
  explore: { key: "explore", label: "grit:explore", emoji: "🗺️", tone: "explore" },
  play: { key: "play", label: "grit:play", emoji: "💃", tone: "play" },
  lab: { key: "lab", label: "grit:lab", emoji: "🔬", tone: "lab" },
  checkin: { key: "checkin", label: "Check-In", emoji: "✅", tone: "checkin" },
  fika: { key: "fika", label: "Friday Fika", emoji: "☕", tone: "fika" },
  hackathon: { key: "hackathon", label: "Hackathon", emoji: "💻", tone: "hackathon" },
  audits: { key: "audits", label: "Raid Audits", emoji: "📋", tone: "audits" },
  exit: { key: "exit", label: "Campus Exit", emoji: "🚪", tone: "exit" },
};

export interface CalEvent {
  id: string;
  title: string;
  category: CategoryKey;
  start: string; // ISO
  end: string; // ISO
  allDay?: boolean;
  location?: string;
  description?: string;
}

// Helper to build ISO strings (local time, no TZ shenanigans for display)
const d = (date: string, time = "00:00") => `${date}T${time}:00`;

export const EVENTS: CalEvent[] = [
  // Week May 17–23, 2026
  {
    id: "play-dance",
    title: "grit:play — Dance with Caro",
    category: "play",
    start: d("2026-05-21", "09:00"),
    end: d("2026-05-21", "10:00"),
  },
  {
    id: "fika-bingo",
    title: "Friday Fika goes Bingo",
    category: "fika",
    start: d("2026-05-22", "14:00"),
    end: d("2026-05-22", "14:45"),
  },
  {
    id: "explore-aland",
    title: "grit:explore — Discover Åland Guided Bus Tour",
    category: "explore",
    start: d("2026-05-23", "13:00"),
    end: d("2026-05-23", "17:00"),
    location: "Åland",
  },

  // Week May 24–30
  {
    id: "raid-sudoku",
    title: "Raid: sudoku",
    category: "raid",
    start: d("2026-05-24", "14:00"),
    end: d("2026-05-26", "14:00"),
  },
  {
    id: "hackathon-1",
    title: "Hackathon",
    category: "hackathon",
    start: d("2026-05-30", "09:00"),
    end: d("2026-05-31", "18:00"),
  },
  {
    id: "ci-2",
    title: "Weekly Check-In May Piscine",
    category: "checkin",
    start: d("2026-05-25", "10:00"),
    end: d("2026-05-25", "11:00"),
  },
  {
    id: "cp-2",
    title: "Checkpoint 02",
    category: "checkpoint",
    start: d("2026-05-26", "12:00"),
    end: d("2026-05-26", "16:00"),
  },
  {
    id: "audits-2",
    title: "Raid audits",
    category: "audits",
    start: d("2026-05-27", "09:00"),
    end: d("2026-05-27", "17:00"),
  },
  {
    id: "lab-meetup",
    title: "grit:lab Partner Meetup",
    category: "lab",
    start: d("2026-05-27", "14:00"),
    end: d("2026-05-27", "16:30"),
  },
  {
    id: "fika-2",
    title: "Friday Fika",
    category: "fika",
    start: d("2026-05-29", "14:00"),
    end: d("2026-05-29", "14:45"),
  },

  // Week May 31–Jun 6
  {
    id: "raid-quadchecker",
    title: "Raid: quadchecker",
    category: "raid",
    start: d("2026-05-31", "11:00"),
    end: d("2026-06-02", "11:00"),
  },
  {
    id: "ci-3",
    title: "Weekly Check-In May Piscine",
    category: "checkin",
    start: d("2026-06-01", "10:00"),
    end: d("2026-06-01", "11:00"),
  },
  {
    id: "audits-3",
    title: "Raid audits",
    category: "audits",
    start: d("2026-06-02", "11:00"),
    end: d("2026-06-02", "17:00"),
  },
  {
    id: "cp-final",
    title: "Final Checkpoint",
    category: "checkpoint",
    start: d("2026-06-03", "09:30"),
    end: d("2026-06-03", "13:30"),
  },
  {
    id: "campus-exit",
    title: "Campus Exit",
    category: "exit",
    start: d("2026-06-03", "13:00"),
    end: d("2026-06-03", "15:00"),
  },
  {
    id: "lab-dinner",
    title: "grit:lab Dinner Party",
    category: "lab",
    start: d("2026-06-03", "18:00"),
    end: d("2026-06-03", "21:00"),
  },
];

export function eventDurationMinutes(e: CalEvent) {
  return (new Date(e.end).getTime() - new Date(e.start).getTime()) / 60000;
}

export function isMultiDay(e: CalEvent) {
  const s = new Date(e.start);
  const en = new Date(e.end);
  return s.toDateString() !== en.toDateString();
}

export function formatTimeRange(e: CalEvent) {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const s = new Date(e.start).toLocaleTimeString([], opts).toLowerCase().replace(" ", "");
  const en = new Date(e.end).toLocaleTimeString([], opts).toLowerCase().replace(" ", "");
  return `${s} – ${en}`;
}
