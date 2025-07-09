"use client"

import { signIn } from "next-auth/react"
import { usePlaylistStore } from "@/store/playlistStore"

export function YouTubeAuthStep() {
  const { selectedPlaylistData, resetWorkflow } = usePlaylistStore()

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        Step 3: Connect to YouTube
      </h2>
      
      {selectedPlaylistData.playlist && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
          <p className="text-green-200">
            ✓ Playlist &quot;{selectedPlaylistData.playlist.name}&quot; saved 
            ({selectedPlaylistData.tracks.length} tracks)
          </p>
        </div>
      )}

      <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
        Now sign in with your YouTube account to create the new playlist. 
        We&apos;ll transfer all your selected Spotify songs to YouTube.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          <span>Connect with YouTube</span>
        </button>

        <button
          onClick={resetWorkflow}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Start Over
        </button>
      </div>

      <div className="mt-8 text-white/60 text-sm">
        <p>We&apos;ll create a new playlist and add your songs to it.</p>
      </div>
    </div>
  )
}
