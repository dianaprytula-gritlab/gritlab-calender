import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, EVENTS, formatTimeRange, type CategoryKey } from "@/lib/events";
import { CategoryChip, toneFor } from "@/components/calendar/category";
import { AgendaView, MonthView } from "@/components/calendar/views";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "grit:calendar — Your week, made simple" },
      { name: "description", content: "A friendlier calendar for grit:lab events — raids, checkpoints, fika, and more." },
      { property: "og:title", content: "grit:calendar" },
      { property: "og:description", content: "A friendlier calendar for grit:lab events." },
    ],
  }),
  component: Index,
});

const ALL_CATS = Object.keys(CATEGORIES) as CategoryKey[];

function Index() {
  const [active, setActive] = useState<Set<CategoryKey>>(new Set(ALL_CATS));
  const [view, setView] = useState<"month" | "agenda">(() => {
    if (typeof window !== "undefined" && window.location.hash.toLowerCase() === "#agenda") return "agenda";
    return "month";
  });

  useEffect(() => {
    const onHash = () => {
      setView(window.location.hash.toLowerCase() === "#agenda" ? "agenda" : "month");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setViewAndHash = (v: "month" | "agenda") => {
    setView(v);
    const newHash = v === "agenda" ? "#Agenda" : "";
    if (typeof window !== "undefined") {
      const url = window.location.pathname + window.location.search + newHash;
      window.history.replaceState(null, "", url);
    }
  };

  const toggle = (k: CategoryKey) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  const now = new Date();
  const upcoming = useMemo(
    () =>
      EVENTS
        .filter(e => active.has(e.category) && new Date(e.end).getTime() >= now.getTime())
        .sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        .slice(0, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active]
  );

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-display text-lg shadow-sm">g:</div>
            <div>
              <div className="font-display text-lg leading-tight">grit:calendar</div>
              <div className="text-xs text-muted-foreground">May – June 2026</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 rounded-full bg-muted p-1">
            {(["month","agenda"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >{v === "month" ? "Month" : "Agenda"}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Welcome back</div>
            <h1 className="font-display text-4xl md:text-5xl mt-1">
              Your weeks, <span className="text-primary italic">decoded.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              All grit:lab raids, checkpoints, fika and explores in one place — color-coded,
              emoji-tagged, and finally readable.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Up next</div>
            <ul className="space-y-3">
              {upcoming.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing upcoming.</li>
              )}
              {upcoming.map(e => {
                const t = toneFor(e.category);
                const meta = CATEGORIES[e.category];
                return (
                  <li key={e.id} className="flex items-start gap-3">
                    <div className={`mt-1 size-8 rounded-lg ${t.soft} ${t.text} grid place-items-center text-base shrink-0`}>
                      {meta.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{e.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(e.start).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                        {" · "}{formatTimeRange(e)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Filters */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Filter by type</h2>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setActive(new Set(ALL_CATS))} className="text-muted-foreground hover:text-foreground">All</button>
              <span className="text-muted-foreground/40">·</span>
              <button onClick={() => setActive(new Set())} className="text-muted-foreground hover:text-foreground">None</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_CATS.map(c => (
              <CategoryChip key={c} category={c} active={active.has(c)} onClick={() => toggle(c)} />
            ))}
          </div>
        </section>

        {/* View */}
        <section>
          {view === "month" ? <MonthView active={active} /> : <AgendaView active={active} />}
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-8 pb-4">
          Built with care · {EVENTS.length} events
        </footer>
      </main>
    </div>
  );
}
