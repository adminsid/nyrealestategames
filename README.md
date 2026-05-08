# nyrealestategames

Cloudflare Worker app for interactive New York real-estate team games.

## Features

- Host creates a live room (desktop-friendly host console)
- Players join with room code or QR link on mobile
- Real-time scoring and progress tracking via Durable Object + WebSockets
- 5 NYC-themed built-in games:
  - Price Pulse NYC
  - Neighborhood Navigator
  - History Hustle
  - Law Lightning
  - Listing Detective
- Questions include source links and verification date metadata

## Run locally

```bash
npx wrangler dev
```

## Deploy

```bash
npx wrangler deploy
```
