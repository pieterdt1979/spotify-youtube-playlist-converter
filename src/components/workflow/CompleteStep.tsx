"use client"

import { usePlaylistStore } from "@/store/playlistStore"

export function CompleteStep() {
  const { selectedPlaylistData, transferProgress, resetWorkflow } = usePlaylistStore()

  const successCount = transferProgress.filter(item => item.status === 'added').length
  const failedCount = transferProgress.filter(item => item.status === 'failed').length
  const totalCount = transferProgress.length

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        🎉 Conversion Complete!
      </h2>

      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold text-lg mb-4">
          &quot;{selectedPlaylistData.playlist?.name}&quot; Results
        </h3>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{successCount}</div>
            <div className="text-green-200 text-sm">Successfully Added</div>
          </div>
          <div className="bg-red-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{failedCount}</div>
            <div className="text-red-200 text-sm">Failed</div>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{totalCount}</div>
            <div className="text-blue-200 text-sm">Total Tracks</div>
          </div>
        </div>
      </div>

      {failedCount > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
          <p className="text-yellow-200 mb-2">
            Some tracks couldn&apos;t be found on YouTube or failed to add.
          </p>
          <p className="text-yellow-200/80 text-sm">
            This is normal - some songs might not be available or have different names on YouTube.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={resetWorkflow}
          className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Convert Another Playlist
        </button>
        
        <a
          href="https://www.youtube.com/feed/playlists"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors inline-block"
        >
          View YouTube Playlists
        </a>
      </div>

      <div className="mt-8 text-white/60 text-sm">
        <p>Thank you for using the Spotify to YouTube converter!</p>
      </div>
    </div>
  )
}
