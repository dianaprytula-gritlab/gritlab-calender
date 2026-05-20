import { useMemo, useState } from "react";
import { CATEGORIES, EVENTS, formatTimeRange, isMultiDay, type CalEvent, type CategoryKey } from "@/lib/events";
import { toneFor } from "./category";
import { EventDialog } from "./event-dialog";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const RANGE_START = new Date(2026, 4, 17); // May 17, 2026
const RANGE_END = new Date(2026, 5, 3);   // June 3, 2026

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function eventOccursOn(e: CalEvent, day: Date) {
  const s = new Date(e.start); s.setHours(0,0,0,0);
  const en = new Date(e.end);  en.setHours(0,0,0,0);
  const d = new Date(day);     d.setHours(0,0,0,0);
  return d.getTime() >= s.getTime() && d.getTime() <= en.getTime();
}

function inRange(day: Date) {
  const d = new Date(day); d.setHours(0,0,0,0);
  const rs = new Date(RANGE_START); rs.setHours(0,0,0,0);
  const re = new Date(RANGE_END); re.setHours(0,0,0,0);
  return d.getTime() >= rs.getTime() && d.getTime() <= re.getTime();
}

export function MonthView({ active }: { active: Set<CategoryKey> }) {
  const [selected, setSelected] = useState<CalEvent | null>(null);

  const cells = useMemo(() => {
    const arr: Date[] = [];
    const start = new Date(2026, 4, 17); // May 17
    for (let i = 0; i < 21; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const visibleEvents = useMemo(() => EVENTS.filter(e => active.has(e.category)), [active]);
  const today = new Date();

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-background to-card">
        <h2 className="font-display text-2xl">
          May 17 <span className="text-muted-foreground">–</span> Jun 3 <span className="text-muted-foreground">2026</span>
        </h2>
      </div>

      <div className="grid grid-cols-7 border-b bg-muted/30">
        {DAYS.map(d => (
          <div key={d} className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dayInRange = inRange(day);
          const dayEvents = dayInRange ? visibleEvents.filter(e => eventOccursOn(e, day)) : [];
          const isToday = sameDay(day, today);
          const rowStart = Math.floor(i / 7) * 7;
          const rowEmpty = cells.slice(rowStart, rowStart + 7).every(
            d => !inRange(d) || visibleEvents.filter(e => eventOccursOn(e, d)).length === 0
          );

          return (
            <div
              key={i}
              className={`${rowEmpty ? "min-h-[44px]" : "min-h-[120px]"]} border-b border-r p-1.5 flex flex-col gap-1 ${
                dayInRange ? "bg-card" : "bg-muted/10"
              } ${(i+1) % 7 === 0 ? "border-r-0" : ""}`}
            >
              <div className="flex items-center justify-between px-1">
                {dayInRange ? (
                  <span className={`text-sm font-medium ${
                    isToday
                      ? "size-7 rounded-full bg-primary text-primary-foreground grid place-items-center"
                      : dayEvents.length === 0
                      ? "text-muted-foreground/50"
                      : "text-foreground"
                  }`}>{day.getDate()}</span>
                ) : (
                  <span className="text-sm text-transparent select-none">{day.getDate()}</span>
                )}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 4).map(e => {
                  const t = toneFor(e.category);
                  const meta = CATEGORIES[e.category];
                  return (
                    <button
                      key={e.id + i}
                      onClick={() => setSelected(e)}
                      className={`${t.soft} ${t.text} text-left text-[11px] leading-tight px-1.5 py-1 rounded-md truncate hover:ring-1 ${t.ring} transition`}
                      title={e.title}
                    >
                      <span className="mr-1">{meta.emoji}</span>
                      <span className="font-medium">{e.title}</span>
                      {!isMultiDay(e) && (
                        <span className="ml-1 opacity-70">{new Date(e.start).toLocaleTimeString([], { hour: "numeric" }).toLowerCase()}</span>
                      )}
                    </button>
                  );
                })}
                {dayEvents.length > 4 && (
                  <span className="text-[10px] text-muted-foreground px-1.5">+{dayEvents.length - 4} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export function AgendaView({ active }: { active: Set<CategoryKey> }) {
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const grouped = useMemo(() => {
    const filtered = EVENTS.filter(e => active.has(e.category)).sort(
      (a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    const map = new Map<string, CalEvent[]>();
    for (const e of filtered) {
      const key = new Date(e.start).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [active]);

  return (
    <div className="space-y-6">
      {grouped.length === 0 && (
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          No events match your filters.
        </div>
      )}
      {grouped.map(([key, items]) => {
        const date = new Date(key);
        const weekday = date.toLocaleDateString("en", { weekday: "long" });
        const day = date.getDate();
        const month = date.toLocaleDateString("en", { month: "short" });
        return (
          <div key={key} className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="flex items-baseline gap-4 px-5 py-4 border-b bg-muted/20">
              <div className="font-display text-3xl">{day}</div>
              <div>
                <div className="font-medium">{weekday}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{month} 2026</div>
              </div>
            </div>
            <ul className="divide-y">
              {items.map(e => {
                const t = toneFor(e.category);
                const meta = CATEGORIES[e.category];
                return (
                  <li key={e.id}>
                    <button
                      onClick={() => setSelected(e)}
                      className="w-full text-left flex items-stretch gap-4 px-5 py-4 hover:bg-muted/40 transition"
                    >
                      <div className={`w-1.5 rounded-full ${t.bg}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{meta.emoji}</span>
                          <span className="font-medium truncate">{e.title}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span>{isMultiDay(e) ? "All day · multi-day" : formatTimeRange(e)}</span>
                          {e.location && <span>· 📍 {e.location}</span>}
                          <span className={`inline-flex items-center gap-1 ${t.text} font-medium`}>
                            <span className={`size-1.5 rounded-full ${t.dot}`} /> {meta.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
