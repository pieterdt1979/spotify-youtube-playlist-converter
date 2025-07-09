"use client"

import { signIn } from "next-auth/react"

export function AuthSection() {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-4xl font-bold text-white mb-6">
          Convert Your Playlists
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Seamlessly transfer your favorite Spotify playlists to YouTube. 
          Authenticate with both services to get started with the conversion process.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => signIn("spotify")}
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Connect Spotify</span>
          </button>

          <button
            onClick={() => signIn("google")}
            className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 12.275c0-.833-.077-1.635-.21-2.404H12v4.548h6.455c-.281 1.485-1.139 2.747-2.433 3.59v2.986h3.947c2.299-2.117 3.529-5.23 3.529-8.72z"/>
              <path d="M12 24c3.24 0 5.956-1.077 7.94-2.905l-3.947-2.986c-1.077.72-2.433 1.14-3.993 1.14-3.069 0-5.67-2.077-6.6-4.868H1.456v3.083C3.438 21.45 7.398 24 12 24z"/>
              <path d="M5.4 14.381c-.24-.72-.374-1.486-.374-2.281s.134-1.561.374-2.281V6.736H1.456C.526 8.465 0 10.155 0 12s.526 3.535 1.456 5.264l3.944-3.083z"/>
              <path d="M12 4.8c1.729 0 3.281.595 4.506 1.758l3.37-3.37C17.952 1.245 15.24 0 12 0 7.398 0 3.438 2.55 1.456 6.736L5.4 9.819C6.33 7.028 8.931 4.8 12 4.8z"/>
            </svg>
            <span>Connect YouTube</span>
          </button>
        </div>

        <div className="mt-8 text-white/60 text-sm">
          <p>Both accounts are required to transfer playlists between services.</p>
        </div>
      </div>
    </div>
  )
}
