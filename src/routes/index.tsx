import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BookingSection, ClubSection, Header, Hero, KitchenSection, scrollTo } from "@/components/pcmania/sections";
import { CheckoutSheet, ConfirmDialog, ProfileDialog } from "@/components/pcmania/overlays";
import {
  CLUBS, DURATIONS, FOOD, ZONES, calcTotals, isValidPromo, nextDays, seatPrice,
  type Booking, type City, type DurationId, type FoodCat, type SeatPick, type ZoneId,
} from "@/lib/pcmania";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PCMANIA — сеть компьютерных клубов | Бронь мест онлайн" },
      { name: "description", content: "Бронируй ПК, VIP-будки и Lounge-комнаты в клубах PCMANIA в Москве, СПб и Казани. RTX 4090, еда к месту, промокоды." },
      { property: "og:title", content: "PCMANIA — твоя игровая арена" },
      { property: "og:description", content: "Бронируй места для себя и друзей в один клик в клубах PCMANIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [city, setCity] = useState<City>("Москва");
  const clubs = useMemo(() => CLUBS.filter((c) => c.city === city), [city]);
  const [clubId, setClubId] = useState(clubs[0]!.id);
  const club = clubs.find((c) => c.id === clubId) ?? clubs[0]!;

  const [dates, setDates] = useState<{ value: string; label: string }[]>([{ value: "today", label: "Сегодня" }]);
  const [date, setDate] = useState("today");
  useEffect(() => {
    const d = nextDays();
    setDates(d);
    setDate(d[0]!.value);
  }, []);
  const dateLabel = dates.find((d) => d.value === date)?.label ?? "Сегодня";

  const [guests, setGuests] = useState(2);
  const [zoneId, setZoneId] = useState<ZoneId>("standard");
  const [durationId, setDurationId] = useState<DurationId>("3h");
  const [seats, setSeats] = useState<SeatPick[]>([]);
  const [foodCat, setFoodCat] = useState<FoodCat>("burgers");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [promo, setPromo] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bonus, setBonus] = useState(450);

  const duration = DURATIONS.find((d) => d.id === durationId)!;
  const zoneOf = (id: ZoneId) => ZONES.find((z) => z.id === id)!;

  const changeCity = (c: City) => {
    setCity(c);
    setClubId(CLUBS.find((x) => x.city === c)!.id);
    setSeats([]);
  };
  const changeClub = (id: string) => {
    if (id !== clubId && seats.length) toast("Клуб изменён — выбор мест сброшен");
    setClubId(id);
    setSeats([]);
  };
  const changeDate = (d: string) => { setDate(d); setSeats([]); };

  const toggleSeat = (s: SeatPick) =>
    setSeats((prev) => (prev.some((x) => x.key === s.key) ? prev.filter((x) => x.key !== s.key) : [...prev, s]));
  const addMany = (list: SeatPick[]) =>
    setSeats((prev) => [...prev, ...list.filter((s) => !prev.some((x) => x.key === s.key))]);
  const removeSeat = (key: string) => setSeats((prev) => prev.filter((x) => x.key !== key));

  const setQty = (id: string, q: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (q <= 0) delete next[id]; else next[id] = q;
      return next;
    });
    if (q === 1 && !cart[id]) toast.success(`${FOOD.find((f) => f.id === id)?.name} добавлен к брони`);
  };

  const seatLines = seats.map((s) => {
    const z = zoneOf(s.zoneId);
    return { key: s.key, title: s.label, sub: `${z.name} · ${duration.label}`, price: seatPrice(z, duration) };
  });
  const foodLines = Object.entries(cart).map(([id, qty]) => {
    const f = FOOD.find((x) => x.id === id)!;
    return { id, name: f.name, qty, price: f.price };
  });
  const totals = calcTotals(
    seatLines.reduce((s, l) => s + l.price, 0),
    foodLines.reduce((s, l) => s + l.price * l.qty, 0),
    promo,
  );
  const cartCount = seats.length + foodLines.reduce((s, l) => s + l.qty, 0);

  const pay = () => {
    const code = `PCM-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-3)}`;
    const bonusEarned = Math.round(totals.total * 0.05);
    const b: Booking = {
      id: code, code, clubName: club.name, clubAddress: club.address, date, dateLabel,
      duration: duration.label, seats: seats.map((s) => s.label),
      food: foodLines.map((f) => ({ name: f.name, qty: f.qty })), total: totals.total, bonusEarned,
    };
    setBookings((prev) => [b, ...prev]);
    setBonus((x) => x + bonusEarned);
    setSeats([]);
    setCart({});
    setPromo(false);
    setCartOpen(false);
    setConfirmed(b);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header city={city} onCity={changeCity} cartCount={cartCount} bonus={bonus}
        onCart={() => setCartOpen(true)} onProfile={() => setProfileOpen(true)} />
      <main>
        <Hero clubs={clubs} clubId={club.id} onClub={changeClub} date={date} dates={dates} onDate={changeDate} guests={guests} onGuests={setGuests} />
        <ClubSection clubs={clubs} clubId={club.id} onClub={changeClub} city={city} />
        <BookingSection club={club} date={date} dateLabel={dateLabel} guests={guests}
          zoneId={zoneId} onZone={setZoneId} durationId={durationId} onDuration={setDurationId}
          seats={seats} onToggle={toggleSeat} onRemove={removeSeat} onAddMany={addMany} onCheckout={() => setCartOpen(true)} />
        <KitchenSection cat={foodCat} onCat={setFoodCat} cart={cart} onQty={setQty} />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground">
          <span className="font-display font-black text-foreground">PC<span className="text-neon">MANIA</span></span>
          <span>Москва · Санкт-Петербург · Казань · 24/7</span>
          <span>+7 (800) 555-13-37</span>
        </div>
      </footer>

      <CheckoutSheet open={cartOpen} onOpenChange={setCartOpen} clubName={club.name} clubAddress={club.address}
        dateLabel={dateLabel} durationLabel={duration.label} seats={seatLines} food={foodLines} totals={totals}
        onRemoveSeat={removeSeat} onQty={setQty} promoApplied={promo}
        onApplyPromo={(c) => { const ok = isValidPromo(c); if (ok) { setPromo(true); toast.success("Промокод PCMANIA применён: −10%"); } return ok; }}
        onClearPromo={() => setPromo(false)} onPay={pay} />
      <ConfirmDialog booking={confirmed} onClose={() => setConfirmed(null)} onProfile={() => { setConfirmed(null); setProfileOpen(true); }} />
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} bonus={bonus} bookings={bookings}
        onBook={() => { setProfileOpen(false); scrollTo("booking"); }} />
    </div>
  );
}
