# Bala Balaji Spices & Dryfruits

A learning project: Next.js storefront with MongoDB (Mongoose), product catalog, and client-side cart.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- MongoDB Atlas (or local MongoDB) + Mongoose
- Cart persisted in `localStorage`

## Getting started

### 1. MongoDB

Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or run MongoDB locally.

### 2. Environment

Copy the example env file and add your connection string:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dryfruits-spices-shop
```

### 3. Install and seed

```bash
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Order notifications (email + SMS)

When an order is placed (COD immediately, Razorpay after payment is verified) and when an admin marks it **Out for delivery**, customers receive an email and SMS.

Add to `.env.local` (see `.env.example`):

- **SMTP** — `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- **Twilio** — `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- **App URL** — `NEXT_PUBLIC_APP_URL` (links in messages)

If SMTP or Twilio are not configured, messages are logged to the server console as `[email:mock]` / `[sms:mock]` so you can test locally without credentials.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start development server       |
| `npm run build`| Production build               |
| `npm run seed` | Reset and seed sample catalog  |

## API routes

- `GET /api/categories`
- `GET /api/products?category=&search=&featured=`
- `GET /api/products/[slug]`

## Project structure

```
src/
  app/           # Pages and API routes
  components/    # UI components
  context/       # Cart context
  lib/
    data/        # Database queries
    models/      # Mongoose schemas
scripts/
  seed.ts        # Sample data
```

## Learning milestones (future)

- User authentication
- Checkout and orders
- Admin product management
- Image uploads and deployment
