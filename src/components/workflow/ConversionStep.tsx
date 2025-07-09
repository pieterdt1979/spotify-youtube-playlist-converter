"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { usePlaylistStore } from "@/store/playlistStore"
import type { SpotifyTrack, TransferProgress } from "@/types"

export function ConversionStep() {
  const { data: session } = useSession()
  const { 
    selectedPlaylistData, 
    transferProgress, 
    updateTransferProgress,
    setCurrentStep 
  } = usePlaylistStore()

  const [isConverting, setIsConverting] = useState(false)
  const [youtubePlaylistId, setYoutubePlaylistId] = useState<string | null>(null)
  const [conversionComplete, setConversionComplete] = useState(false)

  useEffect(() => {
    if (!selectedPlaylistData.playlist || !selectedPlaylistData.tracks.length) {
      // If no data, redirect back to start
      setCurrentStep('spotify-auth')
    }
  }, [selectedPlaylistData, setCurrentStep])

  const createYouTubePlaylist = async () => {
    try {
      const response = await fetch('/api/youtube/playlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${selectedPlaylistData.playlist?.name} (from Spotify)`,
          description: `Converted from Spotify playlist "${selectedPlaylistData.playlist?.name}" with ${selectedPlaylistData.tracks.length} tracks.`,
          privacyStatus: 'private',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create YouTube playlist')
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error creating YouTube playlist:', error)
      throw error
    }
  }

  const searchYouTubeVideo = async (track: SpotifyTrack) => {
    try {
      const searchQuery = `${track.name} ${track.artists.map(a => a.name).join(' ')}`
      const response = await fetch(`/api/youtube/search?query=${encodeURIComponent(searchQuery)}`)
      
      if (!response.ok) {
        throw new Error('Failed to search YouTube')
      }

      const data = await response.json()
      return data.items?.[0]?.id?.videoId || null
    } catch (error) {
      console.error('Error searching YouTube:', error)
      return null
    }
  }

  const addVideoToPlaylist = async (playlistId: string, videoId: string) => {
    try {
      const response = await fetch('/api/youtube/playlist/add-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId,
          videoId,
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Error adding video to playlist:', error)
      return false
    }
  }

  const startConversion = async () => {
    if (!selectedPlaylistData.tracks.length) return

    setIsConverting(true)
    const progress: TransferProgress[] = selectedPlaylistData.tracks.map(track => ({
      songTitle: `${track.name} - ${track.artists.map(a => a.name).join(', ')}`,
      status: 'pending' as const,
    }))

    updateTransferProgress(progress)

    try {
      // Step 1: Create YouTube playlist
      const playlistId = await createYouTubePlaylist()
      setYoutubePlaylistId(playlistId)

      // Step 2: Process each track
      for (let i = 0; i < selectedPlaylistData.tracks.length; i++) {
        const track = selectedPlaylistData.tracks[i]
        
        // Update status to searching
        progress[i].status = 'searching'
        updateTransferProgress([...progress])

        // Search for video
        const videoId = await searchYouTubeVideo(track)
        
        if (videoId) {
          progress[i].status = 'found'
          progress[i].youtubeVideoId = videoId
          updateTransferProgress([...progress])

          // Add to playlist
          const added = await addVideoToPlaylist(playlistId, videoId)
          
          if (added) {
            progress[i].status = 'added'
          } else {
            progress[i].status = 'failed'
            progress[i].error = 'Failed to add to playlist'
          }
        } else {
          progress[i].status = 'failed'
          progress[i].error = 'Video not found on YouTube'
        }

        updateTransferProgress([...progress])
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setConversionComplete(true)
      setCurrentStep('complete')
    } catch (error) {
      console.error('Conversion failed:', error)
    } finally {
      setIsConverting(false)
    }
  }

  if (session?.provider !== 'google') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Authentication Error</h2>
        <p className="text-white/80">Please sign in with YouTube first.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Step 4: Convert Playlist
        </h2>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>

      {selectedPlaylistData.playlist && (
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold text-lg mb-2">
            Ready to Convert: {selectedPlaylistData.playlist.name}
          </h3>
          <p className="text-white/80">
            {selectedPlaylistData.tracks.length} tracks will be converted to YouTube
          </p>
          
          {!isConverting && !conversionComplete && (
            <button
              onClick={startConversion}
              className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Conversion
            </button>
          )}
        </div>
      )}

      {transferProgress.length > 0 && (
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Conversion Progress</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transferProgress.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded">
                <div className="flex-1">
                  <p className="text-white text-sm">{item.songTitle}</p>
                  {item.error && (
                    <p className="text-red-400 text-xs">{item.error}</p>
                  )}
                </div>
                <div className="ml-4">
                  {item.status === 'pending' && (
                    <span className="text-gray-400 text-sm">Waiting...</span>
                  )}
                  {item.status === 'searching' && (
                    <span className="text-yellow-400 text-sm">Searching...</span>
                  )}
                  {item.status === 'found' && (
                    <span className="text-blue-400 text-sm">Found!</span>
                  )}
                  {item.status === 'added' && (
                    <span className="text-green-400 text-sm">✓ Added</span>
                  )}
                  {item.status === 'failed' && (
                    <span className="text-red-400 text-sm">✗ Failed</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {youtubePlaylistId && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-200">
                ✓ YouTube playlist created! 
                <a 
                  href={`https://www.youtube.com/playlist?list=${youtubePlaylistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:text-green-100"
                >
                  View on YouTube
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
