# IMPulse Store - Professional Boosting Services

Professional boosting services website for Rocket League and Rocket League Sideswipe.

## Features

- **Homepage** with available games (desaturated for non-logged users)
- **Authentication system** with Google, Discord and Email
- **Image saturation** activated after login
- **Boosting page** with rank selection and services
- **Responsive design** with Tailwind CSS
- **Futuristic neon purple theme**

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and add your OAuth credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

### 3. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### 5. Configure Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 > Redirect URLs
4. Add: `http://localhost:3000/api/auth/callback/discord`

### 6. Run the project

```bash
npm run dev
```

Access `http://localhost:3000`

## Vercel Deployment

### 1. Push to GitHub

1. Initialize git repository (if not already done)
2. Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/impulse-store.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard:
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://impulse-store.vercel.app`)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `DISCORD_CLIENT_ID`: Your Discord OAuth client ID
   - `DISCORD_CLIENT_SECRET`: Your Discord OAuth client secret

### 3. Update OAuth Redirect URIs

After deploying to Vercel, update your OAuth configurations:

**Google OAuth:**
- Add your Vercel domain to authorized redirect URIs:
  - `https://your-domain.vercel.app/api/auth/callback/google`

**Discord OAuth:**
- Add your Vercel domain to redirect URLs:
  - `https://your-domain.vercel.app/api/auth/callback/discord`

### 4. Redeploy

After updating OAuth redirect URIs, redeploy your project on Vercel.

## Project structure

```
impulse-store/
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/route.ts  # Auth routes
│   │   ├── boosting/[gameId]/page.tsx        # Boosting page per game
│   │   ├── layout.tsx                        # Main layout
│   │   └── page.tsx                          # Homepage
│   ├── auth.ts                               # NextAuth configuration
│   └── components/
│       └── providers.tsx                     # SessionProvider
├── public/
│   └── imgs/                                 # Project images
│       ├── Imp/                              # Logo and branding
│       ├── jogos/                            # Game images
│       └── ranks/                            # Rank images
├── .env.example                              # Environment variables template
└── .env.local                                # Local environment variables (not committed)
```

## Implemented features

✅ Homepage with desaturated games (non-logged user)
✅ Login modal with Google, Discord and Email
✅ Image saturation after login
✅ Route protection (redirects to home if not logged)
✅ Boosting page with available ranks
✅ Header with logged user information
✅ Responsive and modern design
✅ Futuristic neon purple theme

## Next steps

- [ ] Implement payment system
- [ ] Create user dashboard
- [ ] Add support ticket system
- [ ] Implement order history
- [ ] Add chat with boosters
- [ ] Multi-language support
