import { CheckCircle2, Gift, MapPin, QrCode, Tag, Ticket, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Stepper } from "./sections";
import { cn } from "@/lib/utils";
import { formatRub, qrMatrix, type Booking, type Totals } from "@/lib/pcmania";

export function QrTicket({ code, size = 180 }: { code: string; size?: number }) {
  const m = qrMatrix(code);
  return (
    <div className="inline-block rounded-xl bg-foreground p-3">
      <svg width={size} height={size} viewBox={`0 0 ${m.length} ${m.length}`} shapeRendering="crispEdges" aria-label={`QR-код ${code}`}>
        {m.flatMap((row, y) => row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="var(--background)" /> : null)))}
      </svg>
    </div>
  );
}

export interface CheckoutLine { key: string; title: string; sub: string; price: number }
export interface FoodLine { id: string; name: string; qty: number; price: number }

export function CheckoutSheet(p: {
  open: boolean; onOpenChange: (o: boolean) => void;
  clubName: string; clubAddress: string; dateLabel: string; durationLabel: string;
  seats: CheckoutLine[]; food: FoodLine[]; totals: Totals;
  onRemoveSeat: (key: string) => void; onQty: (id: string, q: number) => void;
  promoApplied: boolean; onApplyPromo: (code: string) => boolean; onClearPromo: () => void;
  onPay: () => void;
}) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  return (
    <Sheet open={p.open} onOpenChange={p.onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5 text-left">
          <SheetTitle className="font-display text-xl font-black">Корзина / Бронь</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5"><MapPin className="size-4 text-primary" />{p.clubName}, {p.clubAddress}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 p-5">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-secondary p-3"><div className="text-xs text-muted-foreground">Дата</div><b>{p.dateLabel}</b></div>
            <div className="rounded-lg bg-secondary p-3"><div className="text-xs text-muted-foreground">Время</div><b>{p.durationLabel}</b></div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold uppercase text-muted-foreground">Места ({p.seats.length})</h4>
            {p.seats.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Места не выбраны — выбери их на схеме зала</p> : (
              <div className="space-y-2">{p.seats.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                  <div><b>{s.title}</b><div className="text-xs text-muted-foreground">{s.sub}</div></div>
                  <div className="flex items-center gap-2 font-semibold">{formatRub(s.price)}
                    <button aria-label="Удалить место" onClick={() => p.onRemoveSeat(s.key)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                  </div>
                </div>))}
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold uppercase text-muted-foreground">Еда и напитки</h4>
            {p.food.length === 0 ? <p className="text-sm text-muted-foreground">Пока ничего — загляни в «Кухню и бар»</p> : (
              <div className="space-y-2">{p.food.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                  <div className="min-w-0"><b className="block truncate">{f.name}</b><span className="text-xs text-muted-foreground">{formatRub(f.price * f.qty)}</span></div>
                  <Stepper value={f.qty} onChange={(n) => p.onQty(f.id, n)} max={20} />
                </div>))}
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold uppercase text-muted-foreground">Промокод</h4>
            {p.promoApplied ? (
              <div className="flex items-center justify-between rounded-lg border border-success/50 bg-success/10 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 font-semibold text-success"><CheckCircle2 className="size-4" />PCMANIA · скидка 10%</span>
                <button onClick={p.onClearPromo} className="text-xs text-muted-foreground hover:text-foreground">Убрать</button>
              </div>
            ) : (
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setErr(!p.onApplyPromo(code)); }}>
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input value={code} onChange={(e) => { setCode(e.target.value); setErr(false); }} placeholder="Введите промокод"
                    className={cn("h-10 w-full rounded-lg border bg-secondary pl-9 pr-3 text-sm uppercase outline-none focus:border-primary", err ? "border-destructive" : "border-input")} />
                </div>
                <Button type="submit" variant="neonOutline" className="h-10">Применить</Button>
              </form>
            )}
            {err && <p className="mt-1.5 text-xs text-destructive">Такого промокода нет. Попробуй PCMANIA</p>}
          </div>
        </div>
        <div className="sticky bottom-0 space-y-2 border-t border-border bg-card p-5 text-sm">
          <Row l="Места" v={formatRub(p.totals.seats)} />
          <Row l="Еда и напитки" v={formatRub(p.totals.food)} />
          {p.totals.discount > 0 && <Row l="Скидка по промокоду" v={`−${formatRub(p.totals.discount)}`} cls="text-success" />}
          <div className="flex items-baseline justify-between pt-2">
            <span className="font-bold">К оплате</span>
            <span className="font-display text-2xl font-black text-neon">{formatRub(p.totals.total)}</span>
          </div>
          <Button variant="neon" className="h-12 w-full text-base" disabled={!p.seats.length} onClick={p.onPay}>Оплатить и забронировать</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ l, v, cls }: { l: string; v: string; cls?: string }) {
  return <div className={cn("flex justify-between text-muted-foreground", cls)}><span>{l}</span><span className="font-semibold">{v}</span></div>;
}

function BookingDetails({ b }: { b: Booking }) {
  return (
    <div className="space-y-1.5 rounded-xl bg-secondary p-4 text-left text-sm">
      <Row l="Клуб" v={b.clubName} />
      <Row l="Дата" v={b.dateLabel} />
      <Row l="Время" v={b.duration} />
      <Row l="Места" v={b.seats.join(", ")} />
      {b.food.length > 0 && <Row l="Еда" v={b.food.map((f) => `${f.name} ×${f.qty}`).join(", ")} />}
      <div className="flex justify-between pt-1 font-bold"><span>Оплачено</span><span className="text-primary">{formatRub(b.total)}</span></div>
    </div>
  );
}

export function ConfirmDialog({ booking, onClose, onProfile }: { booking: Booking | null; onClose: () => void; onProfile: () => void }) {
  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-primary/50 bg-card sm:max-w-md">
        {booking && (<>
          <DialogHeader className="items-center text-center sm:text-center">
            <div className="grid size-14 place-items-center rounded-full bg-neon text-primary-foreground shadow-glow"><CheckCircle2 className="size-8" /></div>
            <DialogTitle className="font-display text-2xl font-black">Бронь подтверждена!</DialogTitle>
            <DialogDescription>Покажи QR-код на ресепшене — тебя уже ждут</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2">
            <QrTicket code={booking.code} />
            <span className="font-display text-lg font-black tracking-widest text-primary">{booking.code}</span>
          </div>
          <BookingDetails b={booking} />
          <p className="flex items-center justify-center gap-1.5 text-sm text-success"><Gift className="size-4" />+{booking.bonusEarned} бонусов начислено</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="chip" onClick={onClose}>Готово</Button>
            <Button variant="neon" onClick={onProfile}><Ticket />В кабинет</Button>
          </div>
        </>)}
      </DialogContent>
    </Dialog>
  );
}

export function ProfileDialog({ open, onOpenChange, bonus, bookings, onBook }: { open: boolean; onOpenChange: (o: boolean) => void; bonus: number; bookings: Booking[]; onBook: () => void }) {
  const [active, ...history] = bookings;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Личный кабинет</DialogTitle>
          <DialogDescription className="sr-only">Профиль, бонусы и активные брони</DialogDescription>
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-neon font-display text-2xl font-black text-primary-foreground">Г</div>
            <div className="text-left">
              <div className="font-display text-xl font-black">Геймер_1337</div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Trophy className="size-4 text-accent" />Уровень 12 · Золотой статус</div>
            </div>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
            <div className="text-xs text-muted-foreground">Бонусный баланс</div>
            <div className="font-display text-2xl font-black text-primary">{bonus} Б</div>
            <div className="text-xs text-muted-foreground">1 бонус = 1 ₽</div>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-4">
            <div className="text-xs text-muted-foreground">Всего броней</div>
            <div className="font-display text-2xl font-black">{bookings.length}</div>
            <div className="text-xs text-muted-foreground">кэшбэк 5% бонусами</div>
          </div>
        </div>
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground"><QrCode className="size-4" />Активный QR-билет</h4>
          {active ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/40 p-4 sm:flex-row sm:items-start">
              <QrTicket code={active.code} size={120} />
              <div className="w-full flex-1">
                <div className="mb-2 font-display font-black tracking-widest text-primary">{active.code}</div>
                <BookingDetails b={active} />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">Активных броней пока нет</p>
              <Button variant="neon" className="mt-3" onClick={onBook}>Забронировать место</Button>
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-bold uppercase text-muted-foreground">История</h4>
            <div className="space-y-2">{history.map((b) => (
              <div key={b.id} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                <span><b>{b.code}</b> · {b.clubName}</span><span className="font-semibold">{formatRub(b.total)}</span>
              </div>))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
