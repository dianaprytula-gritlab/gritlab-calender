import { useEffect } from "react";
import { CATEGORIES, formatTimeRange, isMultiDay, type CalEvent } from "@/lib/events";
import { toneFor } from "./category";

export function EventDialog({ event, onClose }: { event: CalEvent | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  if (!event) return null;
  const meta = CATEGORIES[event.category];
  const t = toneFor(event.category);
  const start = new Date(event.start);
  const end = new Date(event.end);
  const dateStr = start.toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const endDateStr = end.toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/30 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-card shadow-2xl overflow-hidden border animate-in zoom-in-95"
      >
        <div className={`${t.soft} px-6 pt-6 pb-5`}>
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${t.text}`}
          >
            <span className={`size-1.5 rounded-full ${t.dot}`} /> {meta.label}
          </div>
          <h3 className="mt-2 font-display text-2xl flex items-start gap-2">
            <span className="text-2xl leading-none">{meta.emoji}</span>
            <span className="flex-1">{event.title}</span>
          </h3>
        </div>

        <div className="px-6 py-5 space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="text-muted-foreground w-20 shrink-0">When</span>
            <span>
              {isMultiDay(event) ? (
                <>
                  {dateStr} <span className="text-muted-foreground">→</span> {endDateStr}
                </>
              ) : (
                <>
                  {dateStr}
                  <br />
                  <span className="text-muted-foreground">{formatTimeRange(event)}</span>
                </>
              )}
            </span>
          </div>
          {event.location && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-20 shrink-0">Where</span>
              <span>📍 {event.location}</span>
            </div>
          )}
          {event.description && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-20 shrink-0">About</span>
              <span>{event.description}</span>
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
