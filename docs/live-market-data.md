# LGRBZ Live Market Data Setup

## Current status

Portfolio transaction data is real from the seeded ledger.

Market prices are currently stable demo values unless live provider mode is enabled.

## Environment variables

Add these to Vercel:

NEXT_PUBLIC_MARKET_PROVIDER_MODE=live
NEXT_PUBLIC_MARKET_PROVIDER=twelvedata
NEXT_PUBLIC_MARKET_API_KEY=your_api_key_here

## Planned providers

- Twelve Data
- Finnhub
- Alpha Vantage
- Polygon
- Yahoo Finance fallback

## Important

Until live provider mode is enabled, market pages show a visible demo warning.
