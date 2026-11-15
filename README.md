# Reliant Forex Partners — mobile portal demo

A clickable, phone-first website version of the **BTE210 Canes Consulting** Figma prototype for
Reliant Forex Partners (24 screens: sign in, dashboard, the 7-step payment flow, recipients,
market orders, rate alerts, transfer history and currency balances).

**Live demo:** https://reliantforexpartnersportal.github.io/

- Works on any phone width (tested at 360, 412 and 1280 px wide); on bigger screens it shows as one centered column.
- Everything is **simulated**: sign-in just opens the dashboard, no real credentials, rates, payments or
  emails, and nothing typed is sent anywhere (no backend). Typed values are only kept in the browser tab.
- Navigation follows the file's *Navigation plan* frame: every button, the `‹` back links, the bottom
  **Dashboard / Home** bar and the **Menu** (7 sections + simulated Sign Out).

## Files

| File | What it is |
| --- | --- |
| `index.html` | All 24 screens (one `<section>` per Figma frame), hash routes like `#/dashboard` |
| `figma-utilities.css` | Spacing, color and type values taken from the Figma design |
| `app.css` | Responsive column, sticky bottom bar, form fields, Menu sheet, tap targets (44 px+) |
| `app.js` | Routing, Menu, confirmations and demo messages |
| `assets/` | Reliant logo and icons exported from the Figma file |

Routes: `sign-in, dashboard, payment, quote, booked-quote, allocate-recipient, funding, review,
confirmation, recipients, recipient, add-recipient, edit-recipient, market-orders, create-order,
review-order, order-detail, completed-orders, rate-alerts, rate-alert, transfers, transfer, balances, usd-balance`.


