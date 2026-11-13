# Pcmania Play And Reserve

Build a modern, interactive single-page web application (SPA) for a cyber club network named "PCMANIA" in a single pass. All visible UI text, buttons, and content must be in Russian. Use local React state (useState) for all data and interactivity—do NOT set up an external database or backend.

1. Visual Style

Theme: Dark gaming aesthetic ("народный" — energetic, bold, accessible).

Colors: Pitch-black background (#0A0A0C), dark card surfaces (#141418), vibrant neon yellow (#FFD600) and bright orange (#FF6B00) accents and gradients.

Interactivity: Every button, filter, seat selector, food item, and modal must work seamlessly via React state.

2. Sections & Features to Include

Header: Logo PCMANIA, city selector (Москва, СПб, Казань), navigation links, "Личный кабинет" button (shows mock profile with bonus balance and active QR-ticket), and a "Корзина / Бронь" button with live counter.

Hero Banner: Catchy headline "Твоя игровая арена. Бронируй места для себя и друзей в один клик" + quick filter bar (Club, Date, Guests count) that scrolls to booking.

Club Selector & Map ("Выбор клуба"): 4 clubs on the left with addresses, metro, and free PC counters; an interactive stylized dark SVG map on the right with clickable pins that switch the active club.

Interactive Room & Seat Booking ("Выбор зала и мест"):

Tabs for zones with hardware specs info: Стандарт (RTX 4070), VIP (будка на 5 чел, RTX 4080), Elite (RTX 4090, OLED), Мафия / Lounge (PS5, 85" ТВ, кальян, настолки), Комната переговоров

 (стримерская/переговорка).

Interactive clickable seat map (PCs and rooms) where users can select multiple spots for friends, pick duration (1ч, 3ч, 5ч, Ночной пакет), and see live price calculation.

Kitchen & Bar ("Кухня и бар"): Tabs (Бургеры и снеки, Пицца, Энергетики, Комбо) with working "+ Добавить к брони" buttons.

Checkout Drawer/Modal: Shows selected club, seats, time, added food, working promo code PCMANIA (-10%), and an "Оплатить и забронировать" button that generates a confirmation modal with a QR code and saves the booking to the user's profile state.

3. Tech Stack

React, Tailwind CSS, lucide-react icons. Keep code clean and concise in minimal files so it builds fast without errors.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e4fa230-03e3-50c7-b84f-e0b1a24087fb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
