# IMPulse Store - Agent Development Guide

## Useful commands

### Development
```bash
npm run dev
```
Starts the development server at http://localhost:3000

### Build
```bash
npm run build
```
Compiles the project for production

### Lint
```bash
npm run lint
```
Checks code issues with ESLint

### Start (production)
```bash
npm start
```
Starts the production server

## Authentication configuration

The project uses NextAuth for authentication with multiple providers:
- Google OAuth
- Discord OAuth
- Email (simulated for MVP)

Credentials must be configured in `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated with openssl rand -base64 32>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
DISCORD_CLIENT_ID=<your-discord-client-id>
DISCORD_CLIENT_SECRET=<your-discord-client-secret>
```

## Image folder structure

- `public/imgs/Imp/` - IMPulse Store logo and branding
- `public/imgs/jogos/` - Game images (Rocket League and Sideswipe)
- `public/imgs/ranks/rl/` - Rocket League ranks
- `public/imgs/ranks/rlss/` - Rocket League Sideswipe ranks

## Code conventions

- Use TypeScript for all files
- Client-side components must have `"use client"` at the top
- Use Tailwind CSS for styling
- Follow Next.js App Router component pattern
- Images should use the `next/image` component

## Authentication flow

1. User clicks "Login"
2. Login modal appears with options (Google, Discord, Email)
3. User chooses provider
4. Redirects to OAuth
5. After login, SessionProvider updates state
6. Game images become saturated
7. User can access boosting pages

## Protected routes

- `/boosting/[gameId]` - Requires authentication
- Redirects to `/` if user is not logged in

## Main dependencies

- `next` - React framework
- `next-auth` - Authentication
- `react` - UI library
- `tailwindcss` - Styling
- `typescript` - Typing

## Planned features

1. Payment system
2. User dashboard
3. Support ticket system
4. Order history
5. Chat with boosters
6. Booster rating system

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
