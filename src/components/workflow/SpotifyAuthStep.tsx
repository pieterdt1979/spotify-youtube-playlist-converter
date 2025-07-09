"use client"

import { signIn } from "next-auth/react"

export function SpotifyAuthStep() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        Step 1: Connect to Spotify
      </h2>
      <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
        First, sign in with your Spotify account to access your playlists. 
        We&apos;ll help you select which playlist you want to convert to YouTube.
      </p>

      <button
        onClick={() => signIn("spotify")}
        className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span>Connect with Spotify</span>
      </button>

      <div className="mt-8 text-white/60 text-sm">
        <p>We&apos;ll only access your playlist information, not modify anything.</p>
      </div>
    </div>
  )
}
