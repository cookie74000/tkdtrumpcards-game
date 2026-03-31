// TKD Top Trumps — Stripe Products & Prices

export const PRODUCTS = {
  APP_ACCESS: {
    name: "TKD Top Trumps — Full Access",
    description: "Unlock the full TKD Top Trumps app: 100 black belt cards, 1-player vs CPU, and 2-player Wi-Fi mode.",
    price: 299, // £2.99 in pence
    currency: "gbp",
    // Set this to your Stripe Price ID once created in the dashboard
    // For now we create a one-time price on the fly via checkout session
    priceId: process.env.STRIPE_PRICE_ID || null,
  },
} as const;
