# Crown & Blade | Luxury Barbershop & Admin Lounge

A full-stack barbershop platform featuring a dark mode aesthetic with deep blacks and rich gold accents, an appointment booking system, and an authenticated Admin Control Panel.

Built with **Node.js (Express)**, **React 19**, **Tailwind CSS**, and **SQLite (sql.js)** for direct deployment on **Render** (or any cloud container).

---

## 💈 Features

### 1. Customer Frontend
- **Home Page**: Hero section, craftsmanship philosophy, featured services, master barber previews, and a **dynamic Customer Reviews Slider** with auto-rotation.
- **Services & Pricing Page**: Categorized grooming rituals (Hair Sculpting, Beard & Straight Razor, The Royal Treatment, Scalp & Facial Therapies) with gold prices and direct booking triggers.
- **Meet the Barbers Page**: Detailed profiles for master artisans including years of experience, specialties, customer ratings, schedule availability, and one-click booking.
- **Contact & Booking Page**:
  - **Live Appointment Booking Form**: Select service, artisan, date, and time slot. Client details are validated and saved directly to the SQLite database via `POST /api/appointments`. Produces a printable digital confirmation pass.
  - **Direct Concierge Contact Form**: Sends client messages directly to the SQLite database via `POST /api/contact`.
  - Location details, operating hours, and interactive map directions.

### 2. Admin Panel (`#admin`)
- **Secure Authentication**: Dark/gold styled login with protected session tokens. (Default: `admin` / `crownblade2026`, auto-fill button provided).
- **Executive Dashboard**:
  - **Overview Stats**: Real-time counters for *Total Bookings Today*, *Pending Inquiries*, *Completed Services*, and *Total Booking Value ($)*.
  - **Appointments Tab**: Full table of all scheduled appointments sorted chronologically, with status filters (All, Confirmed, Completed, Cancelled), search bar, and action triggers (*Mark as Completed*, *Cancel*, *Delete*).
  - **Messages Inbox**: View inquiries sent through the contact form, filter by status, mark as replied, and email clients directly.
  - **Add Walk-In / Phone Booking**: Form allowing lounge staff to log walk-in patrons into the schedule.

---

## 🚀 Render Deployment Guide

This repository is pre-configured for direct deployment on Render Web Services:

1. Create a new **Web Service** on [Render Dashboard](https://dashboard.render.com).
2. Connect your Git repository.
3. Configure the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Set Environment Variables (optional, defaults provided):
   - `PORT`: Handled automatically by Render (defaults to 3000 if not set).
   - `ADMIN_USERNAME`: `admin` (or your chosen username)
   - `ADMIN_PASSWORD`: `crownblade2026` (or your chosen secure password)
   - `ADMIN_SECRET`: Any random secret string for session signing.

---

## 🛠 Local Development & Scripts

```bash
# Start development server (Node + Express + Vite middlewares on port 3000)
npm run dev

# Build production bundle (Client Vite build + Server esbuild bundle)
npm run build

# Start production server
npm start

# Run TypeScript checks
npm run lint
```

## 🗄 Database Details
- Uses **SQLite** (`barbershop.sqlite`), initialized automatically with seed data if empty.
- ACID-compliant, zero external database setup required, persistent file storage.
