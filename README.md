# Spotify to YouTube Playlist Converter

A modern web application built with Next.js and TypeScript that allows users to seamlessly convert their Spotify playlists to YouTube playlists.

## ✨ Features

- **OAuth Authentication** - Secure login with both Spotify and YouTube
- **Playlist Discovery** - Browse and view your Spotify playlists
- **Song Matching** - Intelligent search and matching of Spotify tracks to YouTube videos
- **Bulk Transfer** - Convert entire playlists or select individual songs
- **Progress Tracking** - Real-time progress updates during conversion
- **Error Handling** - Comprehensive error reporting for failed transfers

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with App Router and TypeScript
- **Authentication**: NextAuth.js for OAuth flows
- **State Management**: Zustand for application state
- **Styling**: Tailwind CSS for modern UI
- **APIs**: Spotify Web API and YouTube Data API v3
- **HTTP Client**: Axios for API requests

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Spotify Developer Account
- Google Cloud Platform Account (for YouTube API)

### Environment Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment template and configure your API keys:

```bash
cp .env.example .env.local
```

3. Set up your environment variables in `.env.local`:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube API (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
```

### API Setup

#### Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/api/auth/callback/spotify` to redirect URIs
4. Copy Client ID and Client Secret to your `.env.local`

#### YouTube API (Google)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to your `.env.local`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── pages/api/              # API routes
│   ├── auth/              # NextAuth.js configuration
│   ├── spotify/           # Spotify API endpoints
│   └── youtube/           # YouTube API endpoints
├── store/                 # Zustand state management
└── types/                 # TypeScript type definitions
```

## 🔐 Authentication Flow

The app uses NextAuth.js with a stateless JWT strategy:

1. Users authenticate with Spotify and/or YouTube
2. Access tokens are stored securely in HTTP-only cookies
3. Tokens are automatically refreshed when expired
4. No database required - completely stateless

## 🎵 How It Works

1. **Authentication**: Users sign in with both Spotify and YouTube accounts
2. **Playlist Selection**: Browse and select Spotify playlists to convert
3. **Song Matching**: App searches YouTube for corresponding music videos
4. **Playlist Creation**: Creates new YouTube playlist with matched songs
5. **Progress Tracking**: Real-time updates on conversion progress

## ⚠️ YouTube API Quota Limitations

The YouTube Data API v3 has strict quota limits:
- **Default quota**: 10,000 units per day
- **Playlist creation**: 50 units per playlist
- **Video search**: 100 units per search
- **Adding video to playlist**: 50 units per video

For a 30-song playlist, you'll use approximately:
- 50 units (create playlist) + 30 × 100 units (searches) + 30 × 50 units (additions) = **4,550 units**

**Tips to manage quota:**
- Test with smaller playlists first
- Request quota increase from Google Cloud Console for production use
- Consider implementing caching for repeated searches
- Monitor your usage in the Google Cloud Console

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- AWS
- DigitalOcean

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
