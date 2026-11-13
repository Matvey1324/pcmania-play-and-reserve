import {
  Armchair, CalendarDays, ChevronDown, Cpu, Crown, Gamepad2, MapPin, Minus, Monitor, Pizza, Plus,
  Sandwich, Search, ShoppingCart, Sparkles, TrainFront, User, Users, Video, Zap, Package, X, Flame,
} from "lucide-react";
import type { ReactNode } from "react";
import heroImg from "@/assets/pcmania-hero.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CITIES, DURATIONS, FOOD, FOOD_CATS, ZONES, formatRub, freePcCount, isOccupied, seatPrice,
  type City, type Club, type DurationId, type FoodCat, type SeatPick, type ZoneId,
} from "@/lib/pcmania";

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const selectCls =
  "h-11 w-full appearance-none rounded-lg border border-input bg-secondary px-3 pr-9 text-sm text-foreground outline-none transition focus:border-primary";

function NativeSelect({ value, onChange, children, label }: { value: string; onChange: (v: string) => void; children: ReactNode; label: string }) {
  return (
    <div className="relative">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function SectionTitle({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">{kicker}</p>
        <h2 className="text-3xl font-black uppercase md:text-4xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ───────────── Header ───────────── */
export function Header(p: {
  city: City; onCity: (c: City) => void; cartCount: number; bonus: number;
  onCart: () => void; onProfile: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-display text-xl font-black tracking-tight">
          PC<span className="text-neon">MANIA</span>
        </button>
        <div className="relative ml-1 w-28">
          <MapPin className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-primary" />
          <select aria-label="Город" value={p.city} onChange={(e) => p.onCity(e.target.value as City)}
            className="h-9 w-full appearance-none rounded-lg border border-input bg-secondary pl-8 pr-2 text-sm font-semibold outline-none focus:border-primary">
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <nav className="ml-4 hidden items-center gap-6 text-sm font-semibold text-muted-foreground lg:flex">
          {([["clubs", "Клубы"], ["booking", "Бронь мест"], ["kitchen", "Кухня и бар"]] as const).map(([id, l]) => (
            <button key={id} onClick={() => scrollTo(id)} className="transition hover:text-primary">{l}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="chip" onClick={p.onProfile} className="h-10">
            <User /> <span className="hidden sm:inline">Личный кабинет</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-xs font-bold text-primary">{p.bonus} Б</span>
          </Button>
          <Button variant="neon" onClick={p.onCart} className="relative h-10">
            <ShoppingCart /> <span className="hidden sm:inline">Корзина / Бронь</span>
            <span className="grid min-w-6 place-items-center rounded-full bg-background px-1.5 text-xs font-black text-primary">{p.cartCount}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ───────────── Hero ───────────── */
export function Hero(p: {
  clubs: Club[]; clubId: string; onClub: (id: string) => void;
  date: string; dates: { value: string; label: string }[]; onDate: (d: string) => void;
  guests: number; onGuests: (n: number) => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <img src={heroImg} alt="Игровой зал PCMANIA с неоновой подсветкой" width={1920} height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-hero-fade" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 md:pt-36">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
          <Flame className="size-3.5" /> Открыто 24/7 · 12 клубов
        </span>
        <h1 className="mt-6 max-w-4xl text-4xl font-black uppercase leading-[1.05] md:text-6xl">
          Твоя игровая <span className="text-neon">арена.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Бронируй места для себя и друзей в один клик
        </p>
        <div className="mt-10 grid gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-glow backdrop-blur md:grid-cols-[1.4fr_1.2fr_auto_auto] md:items-end">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Клуб</span>
            <NativeSelect label="Клуб" value={p.clubId} onChange={p.onClub}>
              {p.clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </NativeSelect>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Дата</span>
            <NativeSelect label="Дата" value={p.date} onChange={p.onDate}>
              {p.dates.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </NativeSelect>
          </label>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Гостей</span>
            <Stepper value={p.guests} onChange={p.onGuests} min={1} max={10} />
          </div>
          <Button variant="neon" className="h-11 px-6 text-base" onClick={() => scrollTo("booking")}>
            <Search /> Найти места
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Stepper({ value, onChange, min = 0, max = 99 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex h-11 items-center rounded-lg border border-input bg-secondary">
      <button aria-label="Меньше" onClick={() => onChange(Math.max(min, value - 1))} className="grid h-full w-10 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40" disabled={value <= min}>
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center font-bold">{value}</span>
      <button aria-label="Больше" onClick={() => onChange(Math.min(max, value + 1))} className="grid h-full w-10 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40" disabled={value >= max}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/* ───────────── Clubs + map ───────────── */
export function ClubSection({ clubs, clubId, onClub, city }: { clubs: Club[]; clubId: string; onClub: (id: string) => void; city: City }) {
  const active = clubs.find((c) => c.id === clubId) ?? clubs[0]!;
  return (
    <section id="clubs" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20">
      <SectionTitle kicker={`Город: ${city}`} title="Выбор клуба" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="space-y-3">
          {clubs.map((c) => {
            const free = freePcCount(c);
            const on = c.id === active.id;
            return (
              <button key={c.id} onClick={() => onClub(c.id)}
                className={cn("w-full rounded-xl border bg-card p-4 text-left transition",
                  on ? "border-primary shadow-glow" : "border-border hover:border-primary/50")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={cn("text-base font-bold", on && "text-primary")}>{c.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.address}</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm"><TrainFront className="size-4 text-accent" /> м. {c.metro}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-black text-success">{free}</div>
                    <div className="text-xs text-muted-foreground">свободно из {c.totalPc} ПК</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-2xl border border-border bg-map">
          <svg viewBox="0 0 500 360" className="h-full w-full" role="img" aria-label="Карта клубов">
            <defs>
              <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M25 0H0V25" fill="none" stroke="var(--map-line)" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="500" height="360" fill="url(#grid)" />
            <path d="M-10 250 C 80 210, 140 280, 230 230 S 380 120, 520 160" fill="none" stroke="var(--map-water)" strokeWidth="22" strokeLinecap="round" />
            <g stroke="var(--map-line)" strokeWidth="5" fill="none" strokeLinecap="round">
              <path d="M40 20 L460 340" /><path d="M20 120 H480" /><path d="M250 0 V360" />
              <circle cx="250" cy="180" r="110" strokeWidth="4" />
            </g>
            <ellipse cx="120" cy="300" rx="55" ry="30" fill="var(--success)" opacity="0.08" />
            <ellipse cx="420" cy="60" rx="45" ry="28" fill="var(--success)" opacity="0.08" />
            {clubs.map((c) => {
              const on = c.id === active.id;
              return (
                <g key={c.id} onClick={() => onClub(c.id)} className="cursor-pointer" role="button" aria-label={c.name}>
                  {on && <circle cx={c.x} cy={c.y} r="14" fill="var(--primary)" className="animate-pin" />}
                  <circle cx={c.x} cy={c.y} r={on ? 13 : 10} fill={on ? "var(--primary)" : "var(--accent)"} stroke="var(--background)" strokeWidth="3" />
                  <circle cx={c.x} cy={c.y} r="3.5" fill="var(--background)" />
                  <text x={c.x} y={c.y - 22} textAnchor="middle" fontSize={on ? 13 : 11} fontWeight="700"
                    fill={on ? "var(--primary)" : "var(--muted-foreground)"} style={{ fontFamily: "var(--font-display)" }}>
                    {c.metro}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/90 p-3 backdrop-blur">
            <div>
              <div className="text-sm font-bold">{active.name}</div>
              <div className="text-xs text-muted-foreground">{active.address} · м. {active.metro}</div>
            </div>
            <Button variant="neon" size="sm" onClick={() => scrollTo("booking")}>Бронировать</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Booking ───────────── */
const zoneIcon: Record<ZoneId, typeof Monitor> = { standard: Monitor, vip: Crown, elite: Sparkles, lounge: Gamepad2, meeting: Video };

export function BookingSection(p: {
  club: Club; date: string; dateLabel: string; guests: number;
  zoneId: ZoneId; onZone: (z: ZoneId) => void;
  durationId: DurationId; onDuration: (d: DurationId) => void;
  seats: SeatPick[]; onToggle: (s: SeatPick) => void; onRemove: (key: string) => void;
  onAddMany: (s: SeatPick[]) => void; onCheckout: () => void;
}) {
  const zone = ZONES.find((z) => z.id === p.zoneId)!;
  const duration = DURATIONS.find((d) => d.id === p.durationId)!;
  const selected = new Set(p.seats.map((s) => s.key));
  const total = p.seats.reduce((s, x) => s + seatPrice(ZONES.find((z) => z.id === x.zoneId)!, duration), 0);
  const ZIcon = zoneIcon[zone.id];

  const seatOf = (i: number): SeatPick => {
    const prefix = { standard: "S", vip: "V", elite: "E", lounge: "L", meeting: "R" }[zone.id];
    const label = zone.id === "vip" ? `Будка ${Math.floor(i / 5) + 1} · ${(i % 5) + 1}` : zone.kind === "room" ? `${zone.name} №${i + 1}` : `${prefix}${String(i + 1).padStart(2, "0")}`;
    return { key: `${zone.id}:${i}`, zoneId: zone.id, index: i, label };
  };
  const busy = (i: number) => isOccupied(p.club.id, zone.id, i, p.date);

  const seat = (i: number, big?: boolean) => {
    const s = seatOf(i);
    const occ = busy(i);
    const on = selected.has(s.key);
    return (
      <button key={i} disabled={occ} onClick={() => p.onToggle(s)} title={occ ? "Занято" : s.label}
        className={cn("flex flex-col items-center justify-center gap-1 rounded-lg border text-xs font-bold transition",
          big ? "min-h-28 p-4 text-sm" : "aspect-square",
          occ && "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through",
          !occ && !on && "border-border bg-secondary hover:border-primary hover:text-primary",
          on && "border-primary bg-neon text-primary-foreground shadow-glow")}>
        {big ? <Gamepad2 className="size-6" /> : <Monitor className="size-4" />}
        <span>{zone.kind === "room" ? `№${i + 1}` : zone.id === "vip" ? (i % 5) + 1 : s.label}</span>
        {big && <span className="text-[11px] font-medium opacity-80">{occ ? "Занято" : formatRub(seatPrice(zone, duration))}</span>}
      </button>
    );
  };

  return (
    <section id="booking" className="scroll-mt-20 border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle kicker={`${p.club.name} · ${p.dateLabel}`} title="Выбор зала и мест" />
        <div className="mb-6 flex flex-wrap gap-2">
          {ZONES.map((z) => {
            const I = zoneIcon[z.id];
            return (
              <Button key={z.id} variant={z.id === zone.id ? "chipActive" : "chip"} className="h-10" onClick={() => p.onZone(z.id)}>
                <I /> {z.name}
              </Button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-[auto_1fr]">
              <div className="grid size-14 place-items-center rounded-xl bg-neon text-primary-foreground"><ZIcon className="size-7" /></div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-xl font-black">{zone.name}</h3>
                  <span className="text-sm text-muted-foreground">{zone.tagline}</span>
                  <span className="ml-auto font-display text-lg font-black text-primary">{formatRub(zone.rate)}<span className="text-xs text-muted-foreground"> / час{zone.kind === "room" ? " за комнату" : ""}</span></span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {zone.specs.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-semibold"><Cpu className="size-3.5 text-accent" />{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Длительность</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DURATIONS.map((d) => (
                  <button key={d.id} onClick={() => p.onDuration(d.id)}
                    className={cn("rounded-xl border p-3 text-left transition",
                      d.id === duration.id ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/50")}>
                    <div className={cn("font-bold", d.id === duration.id && "text-primary")}>{d.label}</div>
                    <div className="text-xs text-muted-foreground">{d.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold">Схема зала <span className="text-muted-foreground">· выбери места для себя и друзей</span></p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><i className="size-3 rounded border border-border bg-secondary" />Свободно</span>
                  <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-neon" />Выбрано</span>
                  <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-muted" />Занято</span>
                </div>
              </div>
              <div className="mb-4 rounded-md bg-secondary py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                {zone.kind === "room" ? "Ресепшн" : "Сцена / экран турниров"}
              </div>
              {zone.id === "vip" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }, (_, b) => {
                    const idx = Array.from({ length: 5 }, (_, k) => b * 5 + k);
                    const free = idx.filter((i) => !busy(i)).map(seatOf);
                    return (
                      <div key={b} className="rounded-xl border border-dashed border-primary/40 p-3">
                        <div className="mb-2 flex items-center justify-between text-xs font-bold">
                          <span className="inline-flex items-center gap-1.5"><Armchair className="size-4 text-primary" />Будка {b + 1}</span>
                          <button className="text-primary hover:underline disabled:opacity-40" disabled={!free.length} onClick={() => p.onAddMany(free)}>
                            Вся будка ({free.length})
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">{idx.map((i) => seat(i))}</div>
                      </div>
                    );
                  })}
                </div>
              ) : zone.kind === "room" ? (
                <div className="grid gap-3 sm:grid-cols-3">{Array.from({ length: zone.units }, (_, i) => seat(i, true))}</div>
              ) : (
                <div className={cn("grid gap-2", zone.id === "elite" ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-4 sm:grid-cols-8")}>
                  {Array.from({ length: zone.units }, (_, i) => seat(i))}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-primary/40 bg-card p-5 shadow-glow lg:sticky lg:top-20">
            <h3 className="text-lg font-black">Твоя бронь</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarDays className="size-4" />{p.dateLabel} · {duration.label}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-4" />Выбрано мест: <b className={cn(p.seats.length >= p.guests ? "text-success" : "text-primary")}>{p.seats.length}</b> из {p.guests} гостей
            </p>
            <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
              {p.seats.length === 0 && <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Нажми на свободное место на схеме</p>}
              {p.seats.map((s) => {
                const z = ZONES.find((x) => x.id === s.zoneId)!;
                return (
                  <div key={s.key} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                    <span><b>{s.label}</b> <span className="text-muted-foreground">· {z.name}</span></span>
                    <span className="flex items-center gap-2 font-semibold">{formatRub(seatPrice(z, duration))}
                      <button aria-label="Убрать" onClick={() => p.onRemove(s.key)} className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Итого за места</span>
              <span className="font-display text-2xl font-black text-neon">{formatRub(total)}</span>
            </div>
            <Button variant="neon" className="mt-4 h-12 w-full text-base" disabled={!p.seats.length} onClick={p.onCheckout}>Перейти к оплате</Button>
            <Button variant="neonOutline" className="mt-2 h-10 w-full" onClick={() => scrollTo("kitchen")}><Pizza /> Добавить еду к брони</Button>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Kitchen ───────────── */
const catIcon: Record<FoodCat, typeof Pizza> = { burgers: Sandwich, pizza: Pizza, energy: Zap, combo: Package };

export function KitchenSection({ cat, onCat, cart, onQty }: { cat: FoodCat; onCat: (c: FoodCat) => void; cart: Record<string, number>; onQty: (id: string, q: number) => void }) {
  return (
    <section id="kitchen" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20">
      <SectionTitle kicker="Доставим прямо к ПК" title="Кухня и бар">
        <div className="flex flex-wrap gap-2">
          {FOOD_CATS.map((c) => (
            <Button key={c.id} variant={c.id === cat ? "chipActive" : "chip"} onClick={() => onCat(c.id)}>{c.label}</Button>
          ))}
        </div>
      </SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FOOD.filter((f) => f.cat === cat).map((f) => {
          const I = catIcon[f.cat];
          const q = cart[f.id] ?? 0;
          return (
            <div key={f.id} className={cn("group flex flex-col rounded-2xl border bg-card p-5 transition", q ? "border-primary shadow-glow" : "border-border hover:border-primary/50")}>
              <div className="mb-4 flex items-start justify-between">
                <div className="grid size-14 place-items-center rounded-xl bg-neon text-primary-foreground transition group-hover:rotate-6"><I className="size-7" /></div>
                {f.hit && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-black uppercase text-accent-foreground">Хит</span>}
              </div>
              <h3 className="text-base font-bold">{f.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-display text-lg font-black">{formatRub(f.price)}</span>
                {q ? <Stepper value={q} onChange={(n) => onQty(f.id, n)} max={20} /> : (
                  <Button variant="neon" size="sm" onClick={() => onQty(f.id, 1)}><Plus /> Добавить к брони</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

