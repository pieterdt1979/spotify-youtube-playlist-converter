# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Spotify to YouTube Playlist Converter web application built with Next.js and TypeScript. The app allows users to authenticate with both Spotify and YouTube, view their Spotify playlists, and transfer songs to new YouTube playlists.

## Technical Stack
- **Frontend Framework:** Next.js 14+ with App Router and TypeScript
- **Authentication:** NextAuth.js for OAuth flows (Spotify & YouTube)
- **State Management:** Zustand for application state
- **Styling:** Tailwind CSS
- **APIs:** Spotify Web API and YouTube Data API v3
- **HTTP Client:** Axios for API requests

## Key Features
- OAuth authentication for Spotify and YouTube
- Display user's Spotify playlists and tracks
- Create new YouTube playlists
- Search and match Spotify tracks to YouTube videos
- Individual and bulk song transfer
- Progress tracking and error handling

## Authentication Strategy
- Uses NextAuth.js with custom JWT callbacks
- Stores tokens securely in HTTP-only cookies
- Implements token refresh mechanisms
- No database dependency - stateless authentication

## Development Guidelines
- Use TypeScript for all new code
- Follow Next.js App Router patterns
- Implement proper error handling for API failures
- Use Zustand stores for complex state management
- Apply Tailwind CSS for consistent styling
- Handle OAuth token expiration gracefully
- Implement rate limiting awareness for APIs
