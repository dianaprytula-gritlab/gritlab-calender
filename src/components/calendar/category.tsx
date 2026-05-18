import { CATEGORIES, type CategoryKey } from "@/lib/events";

const TONE_CLASSES: Record<CategoryKey, { bg: string; text: string; soft: string; ring: string; dot: string }> = {
  raid:       { bg: "bg-cat-raid",        text: "text-cat-raid",        soft: "bg-cat-raid-soft",        ring: "ring-cat-raid",        dot: "bg-cat-raid" },
  checkpoint: { bg: "bg-cat-checkpoint",  text: "text-cat-checkpoint",  soft: "bg-cat-checkpoint-soft",  ring: "ring-cat-checkpoint",  dot: "bg-cat-checkpoint" },
  explore:    { bg: "bg-cat-explore",     text: "text-cat-explore",     soft: "bg-cat-explore-soft",     ring: "ring-cat-explore",     dot: "bg-cat-explore" },
  play:       { bg: "bg-cat-play",        text: "text-cat-play",        soft: "bg-cat-play-soft",        ring: "ring-cat-play",        dot: "bg-cat-play" },
  lab:        { bg: "bg-cat-lab",         text: "text-cat-lab",         soft: "bg-cat-lab-soft",         ring: "ring-cat-lab",         dot: "bg-cat-lab" },
  checkin:    { bg: "bg-cat-checkin",     text: "text-cat-checkin",     soft: "bg-cat-checkin-soft",     ring: "ring-cat-checkin",     dot: "bg-cat-checkin" },
  fika:       { bg: "bg-cat-fika",        text: "text-cat-fika",        soft: "bg-cat-fika-soft",        ring: "ring-cat-fika",        dot: "bg-cat-fika" },
  hackathon:  { bg: "bg-cat-hackathon",   text: "text-cat-hackathon",   soft: "bg-cat-hackathon-soft",   ring: "ring-cat-hackathon",   dot: "bg-cat-hackathon" },
  audits:     { bg: "bg-cat-audits",      text: "text-cat-audits",      soft: "bg-cat-audits-soft",      ring: "ring-cat-audits",      dot: "bg-cat-audits" },
  exit:       { bg: "bg-cat-exit",        text: "text-cat-exit",        soft: "bg-cat-exit-soft",        ring: "ring-cat-exit",        dot: "bg-cat-exit" },
};

export function toneFor(c: CategoryKey) {
  return TONE_CLASSES[c];
}

export function CategoryChip({ category, active = true, onClick }: { category: CategoryKey; active?: boolean; onClick?: () => void }) {
  const t = toneFor(category);
  const meta = CATEGORIES[category];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? `${t.soft} ${t.text} border-transparent shadow-sm`
          : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
      }`}
    >
      <span aria-hidden className={`inline-block size-2 rounded-full ${active ? t.dot : "bg-muted-foreground/40"}`} />
      <span className="text-base leading-none">{meta.emoji}</span>
      <span>{meta.label}</span>
    </button>
  );
}
