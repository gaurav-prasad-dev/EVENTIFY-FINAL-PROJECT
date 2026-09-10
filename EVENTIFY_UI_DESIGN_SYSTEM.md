# Eventify — UI Design System & Styling Architecture Guide

> A complete design system, UI component specification, interactive patterns, and timer lifecycle guide for the **Eventify** movie & event booking platform.
> Replicate this design system in new pages, features, or pass it directly to AI assistants for exact visual and architectural consistency.

---

## 📑 Table of Contents
1. [Core Design Tokens & Palette](#1-core-design-tokens--palette)
2. [Layout, Elevation & Typography](#2-layout-elevation--typography)
3. [Step-by-Step User Journey & Page Styling](#3-step-by-step-user-journey--page-styling)
   - [Step 1: Discovery & Browse (Home & Movie Pages)](#step-1-discovery--browse-home--movie-pages)
   - [Step 2: Movie Details & Showtime Selection](#step-2-movie-details--showtime-selection)
   - [Step 3: Seat Selection & Layout Grid](#step-3-seat-selection--layout-grid)
   - [Step 4: Order Review & Checkout](#step-4-order-review--checkout)
   - [Step 5: Ticket Confirmation & Success (QR Code)](#step-5-ticket-confirmation--success-qr-code)
   - [Step 6: Payment Failed & Recovery Flow](#step-6-payment-failed--recovery-flow)
   - [Step 7: Profile, My Bookings & Auth Modal](#step-7-profile-my-bookings--auth-modal)
4. [Master Button & Component Reference Matrix](#4-master-button--component-reference-matrix)
5. [Timers & Lifecycle Architecture](#5-timers--lifecycle-architecture)
6. [AI Prompt Template (Copy-Pasteable)](#6-ai-prompt-template-copy-pasteable)

---

## 1. Core Design Tokens & Palette

### Primary & Accent Colors
| Role | Color Name | Hex Code | Tailwind Classes | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Primary** | Vivid Purple | `#9333EA` / `#7E22CE` | `bg-purple-600`, `text-purple-600` | Main brand accents, primary buttons in modals, location pin, selected seat highlight |
| **Brand Soft** | Light Purple Tint | `#F3E8FF` / `#E9D5FF` | `bg-purple-100`, `bg-purple-200`, `text-purple-800` | Active Home nav pill, timer bar background, sign-in button, avatar badge |
| **Primary Action** | Deep Black | `#000000` | `bg-black text-white hover:bg-gray-800` | Main Proceed CTA, Proceed to Pay, active date selector, primary cards |
| **Success / Time** | Emerald Green | `#16A34A` / `#22C55E` | `bg-green-500 text-white`, `text-green-600` | Active showtimes, payment success header, countdown clock digits, booking status |
| **Success Soft** | Mint Green Tint | `#F0FDF4` / `#DCFCE7` | `bg-green-100 text-green-600`, `hover:bg-green-50` | Active Events nav pill, showtime button hover |
| **Seat Locked** | Warning Amber | `#FDE047` / `#854D0E` | `bg-yellow-300 text-yellow-800` | Seat in hold/locked by other users |
| **Seat Booked** | Disabled Gray | `#D1D5DB` / `#9CA3AF` | `bg-gray-300 text-gray-400` | Occupied / already reserved seats |
| **Destructive** | Crimson Red | `#EF4444` / `#F87171` | `text-red-500`, `bg-red-100 text-red-600` | Active Movies nav pill, payment failed error, "See All" buttons |

### Neutral Backgrounds & Cards
* **Main Canvas:** `bg-gray-50` (`#F9FAFB`) or `bg-gray-100` (`#F3F4F6`)
* **Surface Containers:** `bg-white shadow-sm` or `bg-white shadow-lg rounded-2xl`
* **Dividers & Borders:** `border-gray-200`, `border-b`, `border-t`, or `hr className="my-4"`
* **Backdrop Overlays:** `bg-black/40` or `bg-black/50 backdrop-blur-md`

---

## 2. Layout, Elevation & Typography

### Geometry & Border Radii
* **Pills & Circular Badges:** `rounded-full` (Navigation pills, user avatars, modal toggle switches)
* **Buttons & Form Fields:** `rounded-lg` (8px) or `rounded-xl` (12px)
* **Cards & Modals:** `rounded-2xl` (16px) (Checkout panels, ticket modal, theatre blocks)
* **Seat Arena Card:** `rounded-3xl` (24px) (Large padded theater card)

### Elevation & Transitions
* **Hover Cards:** `transition-all duration-300 hover:shadow-xl hover:-translate-y-1`
* **Buttons:** `transition duration-200` with subtle background darkening (`hover:bg-gray-800` or `hover:bg-gray-200`)
* **Active Scales:** `scale-110` (Selected seat zoom effect)

### Container Layout
* **Full-Width Pages:** `max-w-[1400px] mx-auto px-6`
* **Flow / Details Pages:** `max-w-6xl mx-auto px-6` (MovieDetails, SeatLayout, Checkout)
* **Centered Ticket / Dialogs:** `max-w-md w-full mx-auto` or `w-[350px]` / `w-[380px]`

---

## 3. Step-by-Step User Journey & Page Styling

```
[Home / Movies] ──> [Movie Details & Showtimes] ──> [Seat Layout & Grid]
                                                             │
[Ticket QR (Success)] <── [Order Checkout & Timer] <─────────┘
```

---

### Step 1: Discovery & Browse (Home & Movie Pages)
**Files:** `Navbar.jsx`, `DefaultNavbar.jsx`, `Location.jsx`, `Home.jsx`, `MovieCard.jsx`, `EventCard.jsx`

#### 1. Default Navigation Bar (`DefaultNavbar`)
* **Container:** `w-full h-[60px] bg-white shadow-sm px-6 py-1 flex items-center justify-between`
* **Logo:** `w-[150px]`
* **Location Picker Button:**
  * Layout: `flex items-center gap-2 cursor-pointer`
  * Icon: `IoLocationOutline` in `text-xl text-purple-500`
  * Text: `font-semibold text-gray-800` (e.g. "Indore" or "Select City")
* **Pill Navigation Tabs:**
  * Base: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100`
  * Active Home: `bg-purple-100 text-purple-600`
  * Active Movies: `bg-red-100 text-red-600`
  * Active Events: `bg-green-100 text-green-600`
* **User Section:**
  * Signed in: `w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold cursor-pointer`
  * Signed out: `px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm hover:bg-purple-300 transition`

#### 2. City Selector Modal (`Location.jsx`)
* **Backdrop:** `fixed inset-0 bg-black bg-opacity-40 z-[1000] flex items-center justify-center`
* **Card:** `bg-white w-[90%] max-w-3xl rounded-2xl p-6 relative`
* **Close Button:** `absolute top-3 right-4 text-xl text-gray-600 hover:text-black`
* **Search Input:** `w-full border rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-purple-400`
* **City Grid:** `grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-4`
  * Tile: `p-4 rounded-xl border cursor-pointer text-center hover:bg-blue-50 transition`
  * Active State: `bg-blue-100 border-blue-500`
  * Icon Circle: `h-10 w-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center`

#### 3. Content Rows & Cards (`MovieRow`, `MovieCard`, `EventCard`)
* **Scroller Section:** `px-6 py-8 relative`
  * Header: `flex items-center justify-between mb-5` with Title `text-xl md:text-2xl font-semibold text-gray-900` and "See All" button `text-sm text-red-500 hover:underline`
  * Scroller: `flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide pb-2`
  * Right Gradient Fade: `pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent`
* **Movie Card (`MovieCard`):**
  * Container: `min-w-[200px] max-w-[200px] cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`
  * Poster: `h-[270px] w-full object-cover`
  * Overlay: `absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition`
  * Info: `p-3`
  * Title: `font-semibold text-sm text-gray-900 line-clamp-2`
  * Tag: `text-xs text-gray-500 mt-1` (`UA16+ | Hindi`)
* **Event Card (`EventCard`):**
  * Container: `min-w-[180px] max-w-[180px] group cursor-pointer`
  * Poster: `rounded-xl h-[180px] w-full object-cover group-hover:scale-105 transition-transform duration-300`
  * Badge: `absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded` (`📅 Date`)

---

### Step 2: Movie Details & Showtime Selection
**Files:** `MovieDetails.jsx`, `viewDetailsModal.jsx`, `TrailerPage.jsx`

#### 1. Movie Hero Header
* **Layout:** `max-w-6xl mx-auto p-6 flex gap-6 items-center`
* **Poster with Play Overlay:**
  * Poster: `w-40 rounded-xl shadow-lg`
  * Hover Play Layer: `absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl`
  * Play Badge: `bg-white p-3 rounded-full text-black`
* **Details Block:**
  * Title: `text-3xl font-semibold text-gray-900`
  * Meta: `text-gray-500 mt-2 text-sm` (`UA16+ | HINDI | 150 min`)
  * "View details" Button: `mt-3 px-4 py-2 border rounded-lg hover:bg-gray-200 transition text-sm`

#### 2. Date Selection Ribbon
* **Container:** `max-w-6xl mx-auto px-6 mt-4 flex gap-3 items-center`
* **Month Indicator Pill:** `bg-gray-200 px-3 py-6 rounded-lg text-xs font-semibold text-gray-600 rotate-[-90deg]`
* **Date Buttons:**
  * Inactive: `px-4 py-2 rounded-xl bg-white hover:bg-gray-200 transition text-center`
  * Active: `px-4 py-2 rounded-xl bg-black text-white transition text-center`
  * Day Number: `text-lg font-semibold`
  * Day Text: `text-xs`

#### 3. Availability Legend Ribbon
* **Bar:** `max-w-6xl mx-auto px-6 mt-6 bg-gray-200 py-3 rounded-lg flex gap-6 text-sm text-gray-600`
* **Indicators:** `⚫ Available` | `🟡 Filling fast` | `🔴 Almost full`

#### 4. Theatre & Showtime Cards
* **Theatre Card:** `bg-white p-5 mb-6 rounded-2xl shadow-sm max-w-6xl mx-auto`
* **Theatre Name:** `font-semibold text-lg text-gray-900`
* **Time Slot Pills:** `px-4 py-2 border rounded-lg text-sm hover:bg-green-50 hover:border-green-400 transition`

#### 5. Quick Details Modal (`viewDetailsModal.jsx`)
* **Overlay:** `fixed inset-0 bg-black/50 backdrop-blur-md`
* **Dialog:** `relative bg-white w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl`
* **Close Button:** `absolute top-4 right-4 text-xl`
* **Tab Nav:** `flex gap-6 mt-6 border-b pb-2 text-sm font-medium`
  * Active: `text-blue-600 border-b-2 border-blue-600`
  * Inactive: `text-gray-500`
* **Cast & Crew Grid:** `grid grid-cols-3 gap-4` with `w-20 h-20 rounded-full mx-auto object-cover`

---

### Step 3: Seat Selection & Layout Grid
**Files:** `BookingNavbar.jsx`, `SeatLayout.jsx`, `ShowTiming.jsx`, `SeatGrid.jsx`, `BottomBar.jsx`

#### 1. Context Booking Navbar (`BookingNavbar.jsx`)
* **Bar:** `w-full h-[70px] bg-white px-6 flex items-center justify-between border-b`
* **Center Context:**
  * Movie Title: `text-lg font-semibold`
  * Theatre / City: `text-xs text-gray-500` ("PVR Nexus | Indore")
  * Date & Time: `text-xs text-gray-400` ("Fri, 12 Oct • 07:30 PM")

#### 2. Showtime Switcher Sub-bar (`ShowTiming.jsx`)
* **Container:** `bg-white px-6 py-4 border-b`
* **Showtime Pills:**
  * Selected: `bg-green-500 text-white border-green-500 px-4 py-2 rounded-lg text-sm whitespace-nowrap`
  * Available: `bg-white hover:border-green-400 px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition`

#### 3. Theater Screen & Seat Grid Card (`SeatGrid.jsx`)
* **Container Card:** `bg-white px-12 py-10 rounded-3xl shadow-lg` centered with `flex justify-center mt-12 px-4`
* **Screen Representation:**
  * Curved Screen Line: `w-[420px] h-2 bg-gray-300 rounded-full mx-auto`
  * Direction Text: `text-xs mt-2 text-gray-500 tracking-widest text-center` ("SCREEN THIS WAY")
* **Row & Seat Layout:**
  * Row Line: `flex items-center gap-6 mb-5`
  * Row Letter: `w-6 text-sm text-gray-600 font-semibold` (e.g. `A`, `B`, `C`)
  * Seat Tile: `w-10 h-10 flex items-center justify-center rounded-md text-xs border transition`
* **4 Seat States:**
  | State | Tailwind Classes | Cursor & Behavior |
  | :--- | :--- | :--- |
  | **Available** | `bg-white text-gray-700 border hover:border-blue-400` | `cursor-pointer` |
  | **Selected** | `bg-purple-600 text-white scale-110 border-transparent shadow-sm` | `cursor-pointer` |
  | **Locked** (held) | `bg-yellow-300 text-yellow-800 border-yellow-400` | `cursor-not-allowed opacity-70` |
  | **Booked** (sold) | `bg-gray-300 text-gray-400 border-gray-300` | `cursor-not-allowed opacity-70` |
* **Seat Legend:** `flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-10 text-xs sm:text-sm` (Pill badges with matching mini seat swatches: Available `bg-white border-gray-300`, Selected `bg-purple-600`, Locked `bg-yellow-300 border-yellow-400`, Booked `bg-gray-300 border-gray-300`)

#### 4. Fixed Bottom Action Bar (`BottomBar.jsx`)
* **Bar:** `fixed bottom-0 left-0 w-full bg-white shadow-lg px-8 py-4 flex justify-between items-center border-t z-40`
* **Seat Summary:**
  * Label: `text-sm text-gray-500` ("2 Seats Selected")
  * Amount: `text-lg font-semibold text-gray-900` ("₹400")
* **"Proceed" CTA Button:**
  * Active: `px-8 py-3 rounded-xl text-sm font-medium transition bg-black text-white hover:bg-gray-800`
  * Inactive (0 selected): `bg-gray-400 text-white cursor-not-allowed`

---

### Step 4: Order Review & Checkout
**File:** `CheckOutTime.jsx`

#### 1. Countdown Timer Ribbon
* **Banner:** `bg-purple-100 text-center py-2 text-sm text-gray-700`
* **Time Highlight:** `font-semibold text-green-600` (e.g. "Complete your booking in **08:14** mins")

#### 2. Booking Expired Modal (When Timer hits 0:00)
* **Backdrop:** `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`
* **Card:** `bg-white rounded-2xl p-6 w-[350px] text-center shadow-xl`
* **Title:** `text-lg font-semibold mb-2` ("Booking Expired")
* **Description:** `text-sm text-gray-600 mb-4` ("Your selected seats have been released.")
* **CTA Button:** `bg-black text-white px-4 py-2 rounded-lg w-full font-medium hover:bg-gray-800` ("Book Again")

#### 3. Checkout 2-Column Grid (`max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6`)
* **Left Column — Ticket Details (`md:col-span-2 space-y-6`):**
  * Card: `bg-white rounded-2xl shadow p-6`
  * Movie Title: `text-xl font-semibold mb-2`
  * Certification & Language: `text-sm text-gray-600` (`UA16+ • Hindi • 2D`)
  * Theatre Name: `text-sm text-gray-600 mt-1`
  * Divider: `hr className="my-4"`
  * Date & Time: `text-sm font-medium` + `text-sm text-gray-600`
  * Seats Row: `flex justify-between items-center`
    * Quantity: `font-semibold` ("2 ticket")
    * Category & Numbers: `text-sm text-gray-600` ("PREMIUM - A1, A2")
    * Screen Number: `text-xs text-gray-500` ("SCREEN 1")
    * Base Price: `font-semibold text-lg` ("₹400")
  * Cancellation Restriction: `mt-4 text-sm text-gray-400 flex items-center gap-2` ("🚫 Cancellation is unavailable")
* **Right Column — Payment Summary & CTA (`space-y-6`):**
  * Payment Card: `bg-white rounded-2xl shadow p-6`
    * Subtotal: `flex justify-between text-sm mb-2`
    * Booking Charge & GST: `flex justify-between text-sm mb-4`
    * Total to be paid: `flex justify-between font-semibold text-base`
  * User Info Card: `bg-white rounded-2xl shadow p-6`
    * Email & City: `text-sm text-gray-700`
  * **Primary CTA ("Proceed To Pay"):**
    * Button: `w-full py-4 rounded-2xl flex justify-between items-center px-6 transition`
    * Active State: `bg-black text-white hover:bg-gray-800`
    * Expired State: `bg-gray-400 cursor-not-allowed`
    * Left side: `text-lg font-semibold` ("₹480")
    * Right side: `font-medium` ("Proceed To Pay")

---

### Step 5: Ticket Confirmation & Success (QR Code)
**File:** `Success.jsx`

* **Layout:** `min-h-screen bg-gray-100 flex justify-center items-center p-4`
* **Ticket Card:** `bg-white rounded-2xl shadow-lg p-6 max-w-md w-full`
* **Success Heading:** `text-2xl font-bold text-green-600 text-center` ("Payment Successful 🎉")
* **Movie Info:** `mt-4 text-center` with `text-lg font-semibold` and `text-gray-500 text-sm`
* **Ticket Data Table:**
  * Row: `flex justify-between text-sm mt-2`
  * Labels: `text-gray-500`
  * Values: `font-medium text-gray-900`
* **QR Code Section:**
  * Container: `mt-6 flex justify-center`
  * QR Code: `w-40 h-40`
  * Help Caption: `text-center text-xs text-gray-400 mt-4` ("Show this QR at entry")

---

### Step 6: Payment Failed & Recovery Flow
**File:** `PaymentFailed.jsx`

* **Layout:** `min-h-screen flex items-center justify-center bg-gray-100 p-4`
* **Card:** `bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center`
* **Error Icon:** `text-red-500 text-6xl mb-4` ("❌")
* **Heading:** `text-2xl font-bold mb-2` ("Payment Failed")
* **Explanation:** `text-gray-600 mb-6 text-sm`
* **Booking ID Box:** `bg-gray-100 rounded-lg p-4 mb-6 text-sm text-gray-700 font-semibold break-all`
* **Action Buttons:**
  * Retry Payment: `w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition`
  * Choose Different Show: `w-full border py-3 rounded-lg font-medium hover:bg-gray-50 transition`

---

### Step 7: Profile, My Bookings & Auth Modal
**Files:** `LoginModal.jsx`, `Sidebar.jsx`, `MyBookings.jsx`

#### 1. Authentication Modal (`LoginModal.jsx`)
* **Overlay:** `fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]`
* **Card:** `bg-white w-[380px] rounded-2xl p-6 relative`
* **Email / Phone Toggle:**
  * Track: `flex bg-gray-100 rounded-full p-1 mb-5`
  * Active Option: `bg-white shadow text-purple-700 flex-1 py-2 rounded-full font-medium`
  * Inactive Option: `text-gray-500 flex-1 py-2 rounded-full`
* **Input Box:** `w-full border px-4 py-2 rounded-lg mb-4 outline-none`
* **Send / Verify Button:** `w-full bg-purple-600 text-white py-2 rounded-lg mb-4 font-medium hover:bg-purple-700 transition`
* **6-Digit OTP Box Grid:**
  * Container: `flex justify-between mb-4`
  * Individual Input: `w-10 h-10 border text-center rounded-lg text-lg font-semibold focus:border-purple-600`
* **Resend OTP Timer:**
  * Active: `text-center text-sm text-gray-500` ("Resend OTP in 28s")
  * Expired: `text-purple-600 cursor-pointer hover:underline` ("Resend OTP")

#### 2. Slide-over Profile Drawer (`Sidebar.jsx`)
* **Backdrop & Drawer:** `fixed inset-0 z-50 flex justify-end bg-black/40` with `w-80 h-full bg-gray-100 shadow-xl p-5`
* **User Profile Header:**
  * Avatar: `w-14 h-14 flex items-center justify-center rounded-full bg-purple-300 text-purple-700 text-xl font-bold`
  * Info: `font-semibold text-gray-900` + `text-sm text-gray-500`
* **Menu Group Card:** `bg-white rounded-xl shadow-sm mb-5 overflow-hidden`
  * Items: `px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 text-sm`
* **Logout Button:** `w-full bg-white py-3 rounded-xl text-left px-4 shadow-sm hover:bg-gray-50 font-medium text-red-600`

---

## 4. Master Button & Component Reference Matrix

| Button Type | Tailwind Class Specification | Visual / Functional State |
| :--- | :--- | :--- |
| **Full-Width Dual Proceed CTA** | `w-full py-4 rounded-2xl flex justify-between items-center px-6 bg-black text-white hover:bg-gray-800` | Displays price on the left (`text-lg font-semibold`) and action on the right (`font-medium`). |
| **Floating Bottom Bar Proceed** | `px-8 py-3 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-800` | Disabled: `bg-gray-400 cursor-not-allowed` when `selectedSeats.length === 0`. |
| **Primary Brand Action** | `w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium transition` | Used for Send OTP / Verify OTP. |
| **Showtime Slot (Active)** | `px-4 py-2 rounded-lg border text-sm whitespace-nowrap bg-green-500 text-white border-green-500` | Highlighted active showtime. |
| **Showtime Slot (Standard)** | `px-4 py-2 rounded-lg border text-sm whitespace-nowrap bg-white hover:bg-green-50 hover:border-green-400 transition` | Standard selectable showtime. |
| **Date Ribbon (Active)** | `px-4 py-2 rounded-xl bg-black text-white transition text-center` | Selected date. |
| **Date Ribbon (Inactive)** | `px-4 py-2 rounded-xl bg-white hover:bg-gray-200 transition text-center` | Unselected date. |
| **Outlined Secondary Button** | `px-4 py-2 border rounded-lg hover:bg-gray-200 transition text-sm` | "View details", retry/switch buttons. |
| **Navbar Pill Tab** | `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200` | Inactive: `text-gray-700 hover:bg-gray-100`. |
| **Close Modal Icon** | `absolute top-3 right-4 text-xl text-gray-500 hover:text-black` | Floating close button on dialogs. |

---

## 5. Timers & Lifecycle Architecture

### 1. Checkout Hold Countdown Timer (`CheckOutTime.jsx`)
* **Lifespan:** Dynamic based on backend booking document (`booking.expiresAt`), standard hold duration: **8–10 minutes** (480–600 seconds).
* **Clock Drift Prevention (Server Offset):**
  ```javascript
  const serverTime = new Date(res.serverTime).getTime();
  const clientTime = Date.now();
  setServerOffset(serverTime - clientTime);
  ```
* **Interval Loop:** 1000ms via `setInterval`.
  ```javascript
  const now = Date.now() + serverOffset;
  const diff = Math.max(Math.floor((new Date(booking.expiresAt).getTime() - now) / 1000), 0);
  ```
* **Display Format:** `M:SS` (e.g. `08:04`, `00:15`).
* **Timer Expiration Triggers:**
  1. `diff <= 0` immediately clears interval.
  2. Sets `expired = true`.
  3. Disables Proceed button (`bg-gray-400 cursor-not-allowed`).
  4. Opens `showExpiredModal` overlay with "Book Again" button navigating to `/`.

### 2. OTP Resend Countdown Timer (`LoginModal.jsx`)
* **Lifespan:** 30 seconds.
* **State Behavior:**
  * When `timer > 0`: displays `Resend OTP in 30s` in muted text (`text-gray-500 text-sm`).
  * When `timer === 0`: converts into clickable link `Resend OTP` (`text-purple-600 cursor-pointer hover:underline`).

---

## 6. AI Prompt Template (Copy-Pasteable)

When asking an AI model to design a new page or feature for **Eventify**, paste this prompt block:

```text
Build a React page using Tailwind CSS that strictly matches the Eventify Design System:

1. Color Palette:
   - Primary Accent: Brand Purple (Tailwind purple-600 / #9333EA, soft purple-100 for light badges/active items).
   - Primary Action / CTAs: Solid Black (#000000) with hover:bg-gray-800 and rounded-xl or rounded-2xl.
   - Status & Showtimes: Emerald Green (green-500 for active, green-50 for hover, text-green-600 for timer and success).
   - Seat States: Available (white border hover:border-blue-400), Selected (bg-purple-600 text-white scale-110), Locked (bg-yellow-300 text-yellow-800), Booked (bg-gray-300 text-gray-400).
   - Backgrounds: Neutral canvas (bg-gray-50 or bg-gray-100) with surface cards (bg-white shadow-sm or shadow-lg).

2. Component Geometry & Layout:
   - Floating header/navbar: height 60px (Default) or 70px (Booking Context with movie details).
   - Cards use rounded-2xl (16px) with p-6 and shadow-sm or shadow-lg.
   - Seat Grid uses rounded-3xl with px-12 py-10 and curved screen indicator (w-[420px] h-2 bg-gray-300 rounded-full).
   - Page containers use max-w-6xl mx-auto or max-w-[1400px] mx-auto.

3. Buttons & Interactivity:
   - Main Checkout CTA: w-full py-4 rounded-2xl flex justify-between items-center px-6 bg-black text-white hover:bg-gray-800 (Price on left, Label on right).
   - Fixed Bottom Bar: fixed bottom-0 left-0 w-full bg-white shadow-lg px-8 py-4 flex justify-between items-center border-t.
   - Modals use fixed inset-0 bg-black/40 or bg-black/50 backdrop-blur-md.

4. Timers:
   - Checkout Timer: Top banner bg-purple-100 py-2 text-sm with synchronized server offset and font-semibold text-green-600 clock digits.
```
