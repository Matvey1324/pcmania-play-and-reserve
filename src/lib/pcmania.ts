export type City = "Киев" | "Львов" | "Днепр" | "Одесса" | "Кривой Рог";
export const CITIES: City[] = ["Киев", "Львов", "Днепр", "Одесса", "Кривой Рог"];

export interface Club {
  id: string;
  city: City;
  name: string;
  address: string;
  /** Metro station or district shown under the address. */
  location: string;
  hasMetro: boolean;
  totalPc: number;
  x: number;
  y: number;
}

export const CLUBS: Club[] = [
  { id: "kyiv-1", city: "Киев", name: "PCMANIA Крещатик", address: "ул. Крещатик, 22", location: "Майдан Независимости", hasMetro: true, totalPc: 64, x: 250, y: 175 },
  { id: "kyiv-2", city: "Киев", name: "PCMANIA Позняки", address: "пр-т Петра Григоренко, 28", location: "Позняки", hasMetro: true, totalPc: 56, x: 400, y: 290 },
  { id: "kyiv-3", city: "Киев", name: "PCMANIA Оболонь", address: "Оболонский пр-т, 1Б", location: "Оболонь", hasMetro: true, totalPc: 48, x: 280, y: 55 },
  { id: "kyiv-4", city: "Киев", name: "PCMANIA Политех", address: "пр-т Берестейский, 37", location: "Политехнический институт", hasMetro: true, totalPc: 52, x: 120, y: 200 },
  { id: "lviv-1", city: "Львов", name: "PCMANIA Центр", address: "пр-т Свободы, 15", location: "Галицкий р-н", hasMetro: false, totalPc: 50, x: 230, y: 150 },
  { id: "lviv-2", city: "Львов", name: "PCMANIA Сыхов", address: "пр-т Червоной Калины, 62", location: "Сыховский р-н", hasMetro: false, totalPc: 44, x: 370, y: 300 },
  { id: "lviv-3", city: "Львов", name: "PCMANIA Форум", address: "ул. Под Дубом, 7Б", location: "Шевченковский р-н", hasMetro: false, totalPc: 40, x: 300, y: 70 },
  { id: "dnipro-1", city: "Днепр", name: "PCMANIA Мост-Сити", address: "ул. Королевы Елизаветы II, 2", location: "Центр", hasMetro: false, totalPc: 60, x: 230, y: 130 },
  { id: "dnipro-2", city: "Днепр", name: "PCMANIA Победа", address: "пр-т Героев, 11Л", location: "ж/м Победа", hasMetro: false, totalPc: 46, x: 120, y: 290 },
  { id: "dnipro-3", city: "Днепр", name: "PCMANIA Гагарина", address: "пр-т Науки, 24", location: "Соборный р-н", hasMetro: false, totalPc: 42, x: 360, y: 220 },
  { id: "odesa-1", city: "Одесса", name: "PCMANIA Дерибасовская", address: "ул. Дерибасовская, 14", location: "Приморский р-н", hasMetro: false, totalPc: 58, x: 330, y: 90 },
  { id: "odesa-2", city: "Одесса", name: "PCMANIA Аркадия", address: "Аркадийская аллея, 1", location: "Аркадия", hasMetro: false, totalPc: 48, x: 390, y: 230 },
  { id: "odesa-3", city: "Одесса", name: "PCMANIA Таирова", address: "пр-т Академика Глушко, 14", location: "пос. Таирова", hasMetro: false, totalPc: 44, x: 170, y: 300 },
  { id: "kr-1", city: "Кривой Рог", name: "PCMANIA 95-й квартал", address: "пр-т Мира, 28", location: "95-й квартал", hasMetro: false, totalPc: 46, x: 220, y: 110 },
  { id: "kr-2", city: "Кривой Рог", name: "PCMANIA Солнечный", address: "мкр-н Солнечный, 35А", location: "Солнечный", hasMetro: false, totalPc: 40, x: 380, y: 280 },
  { id: "kr-3", city: "Кривой Рог", name: "PCMANIA Соцгород", address: "ул. Соборности, 29", location: "Соцгород", hasMetro: false, totalPc: 38, x: 130, y: 250 },
];

/** Deterministic pseudo-random number in [0,1) from a string seed. */
export function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function freePcCount(club: Club): number {
  return Math.round(club.totalPc * (0.25 + seeded(club.id) * 0.5));
}

export type ZoneId = "standard" | "vip" | "elite" | "lounge" | "meeting";
export interface Zone {
  id: ZoneId;
  name: string;
  tagline: string;
  specs: string[];
  rate: number; // ₴ per seat/room per hour
  kind: "pc" | "room";
  units: number;
  unitLabel: string;
  groupSize?: number;
}

export const ZONES: Zone[] = [
  { id: "standard", name: "Стандарт", tagline: "Для катки после учёбы", specs: ["RTX 4070", "Intel i5-13400F", "27\" 240 Гц", "HyperX Alloy + Pulsefire"], rate: 100, kind: "pc", units: 24, unitLabel: "ПК" },
  { id: "vip", name: "VIP", tagline: "Будка на 5 человек", specs: ["RTX 4080", "Intel i7-14700K", "27\" 280 Гц", "Закрытая будка на 5 чел"], rate: 160, kind: "pc", units: 20, unitLabel: "ПК", groupSize: 5 },
  { id: "elite", name: "Elite", tagline: "Максималка без компромиссов", specs: ["RTX 4090", "Intel i9-14900K", "OLED 360 Гц", "Logitech Pro + кресло DXRacer"], rate: 250, kind: "pc", units: 12, unitLabel: "ПК" },
  { id: "lounge", name: "Мафия / Lounge", tagline: "Тусовка для компании", specs: ["PlayStation 5", "85\" 4K ТВ", "Кальян", "Настольные игры и Мафия"], rate: 800, kind: "room", units: 3, unitLabel: "Комната" },
  { id: "meeting", name: "Комната переговоров", tagline: "Стримерская / переговорка", specs: ["RTX 4080 + стрим-кит", "Shure SM7B, Elgato", "Свет и хромакей", "Проектор, до 8 чел"], rate: 600, kind: "room", units: 2, unitLabel: "Комната" },
];

export type DurationId = "1h" | "3h" | "5h" | "night";
export interface Duration {
  id: DurationId;
  label: string;
  hint: string;
  factor: number; // multiplier on hourly rate
}
export const DURATIONS: Duration[] = [
  { id: "1h", label: "1 час", hint: "базовая цена", factor: 1 },
  { id: "3h", label: "3 часа", hint: "−10%", factor: 2.7 },
  { id: "5h", label: "5 часов", hint: "−15%", factor: 4.25 },
  { id: "night", label: "Ночной пакет", hint: "22:00–08:00", factor: 5 },
];

export function seatPrice(zone: Zone, duration: Duration): number {
  return Math.round(zone.rate * duration.factor);
}

export function isOccupied(clubId: string, zoneId: ZoneId, index: number, date: string): boolean {
  return seeded(`${clubId}-${zoneId}-${index}-${date}`) < 0.3;
}

export type FoodCat = "burgers" | "pizza" | "energy" | "combo";
export const FOOD_CATS: { id: FoodCat; label: string }[] = [
  { id: "burgers", label: "Бургеры и снеки" },
  { id: "pizza", label: "Пицца" },
  { id: "energy", label: "Энергетики" },
  { id: "combo", label: "Комбо" },
];
export interface FoodItem {
  id: string;
  cat: FoodCat;
  name: string;
  desc: string;
  price: number;
  hit?: boolean;
}
export const FOOD: FoodItem[] = [
  { id: "b1", cat: "burgers", name: "Бургер «Хедшот»", desc: "Двойная говядина, чеддер, бекон", price: 220, hit: true },
  { id: "b2", cat: "burgers", name: "Чикен-бургер", desc: "Хрустящая курица, соус ранч", price: 180 },
  { id: "b3", cat: "burgers", name: "Картошка фри", desc: "Большая порция + соус", price: 120 },
  { id: "b4", cat: "burgers", name: "Наггетсы 9 шт", desc: "С сырным и BBQ соусом", price: 150 },
  { id: "p1", cat: "pizza", name: "Пепперони", desc: "30 см, двойная пепперони", price: 260, hit: true },
  { id: "p2", cat: "pizza", name: "Четыре сыра", desc: "30 см, моцарелла, дор блю", price: 280 },
  { id: "p3", cat: "pizza", name: "BBQ Чикен", desc: "30 см, курица, лук, соус BBQ", price: 270 },
  { id: "e1", cat: "energy", name: "Burn 0.45", desc: "Классический", price: 55 },
  { id: "e2", cat: "energy", name: "Red Bull 0.35", desc: "Оригинальный", price: 80, hit: true },
  { id: "e3", cat: "energy", name: "Monster Ultra", desc: "Без сахара, 0.5", price: 75 },
  { id: "e4", cat: "energy", name: "Gorilla Mango", desc: "Манго-кокос, 0.45", price: 50 },
  { id: "c1", cat: "combo", name: "Комбо «Соло»", desc: "Бургер + фри + энергетик", price: 320, hit: true },
  { id: "c2", cat: "combo", name: "Комбо «Пати 5»", desc: "2 пиццы + 5 энергетиков + наггетсы", price: 1090 },
  { id: "c3", cat: "combo", name: "Комбо «Ночник»", desc: "Пицца + 2 энергетика + снеки", price: 490 },
];

export const PROMO_CODE = "PCMANIA";
export const PROMO_DISCOUNT = 0.1;

export interface Totals {
  seats: number;
  food: number;
  subtotal: number;
  discount: number;
  total: number;
}
export function calcTotals(seatsSum: number, foodSum: number, promoApplied: boolean): Totals {
  const subtotal = seatsSum + foodSum;
  const discount = promoApplied ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  return { seats: seatsSum, food: foodSum, subtotal, discount, total: subtotal - discount };
}

export function isValidPromo(code: string): boolean {
  return code.trim().toUpperCase() === PROMO_CODE;
}

export function formatUah(n: number): string {
  return `${n.toLocaleString("ru-RU")} ₴`;
}

export function nextDays(count = 7): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const base = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const value = d.toISOString().slice(0, 10);
    const pretty = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" });
    out.push({ value, label: i === 0 ? `Сегодня, ${pretty}` : i === 1 ? `Завтра, ${pretty}` : pretty });
  }
  return out;
}

/** 25x25 matrix that looks like a QR code, derived from the booking code. */
export function qrMatrix(code: string, size = 25): boolean[][] {
  const m: boolean[][] = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => seeded(`${code}:${x}:${y}`) > 0.5),
  );
  const finder = (ox: number, oy: number) => {
    for (let y = -1; y <= 7; y++)
      for (let x = -1; x <= 7; x++) {
        const px = ox + x, py = oy + y;
        if (px < 0 || py < 0 || px >= size || py >= size) continue;
        const ring = x === 0 || x === 6 || y === 0 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[py]![px] = x >= 0 && x <= 6 && y >= 0 && y <= 6 && (ring || core);
      }
  };
  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);
  return m;
}

export interface SeatPick {
  key: string;
  zoneId: ZoneId;
  index: number;
  label: string;
}

export interface Booking {
  id: string;
  code: string;
  clubName: string;
  clubAddress: string;
  date: string;
  dateLabel: string;
  duration: string;
  seats: string[];
  food: { name: string; qty: number }[];
  total: number;
  bonusEarned: number;
}
