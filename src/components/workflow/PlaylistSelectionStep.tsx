"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { usePlaylistStore } from "@/store/playlistStore"
import type { SpotifyPlaylist, SpotifyTrack } from "@/types"

export function PlaylistSelectionStep() {
  const { data: session } = useSession()
  const {
    spotifyPlaylists,
    isLoading,
    error,
    setSpotifyPlaylists,
    setLoading,
    setError,
    saveSelectedPlaylistData,
  } = usePlaylistStore()

  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null)
  const [playlistTracks, setPlaylistTracks] = useState<SpotifyTrack[]>([])
  const [loadingTracks, setLoadingTracks] = useState(false)

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.accessToken || session.provider !== 'spotify') return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/spotify/playlists')
        if (!response.ok) {
          throw new Error('Failed to fetch playlists')
        }

        const data = await response.json()
        setSpotifyPlaylists(data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch playlists')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [session, setSpotifyPlaylists, setLoading, setError])

  const fetchPlaylistTracks = async (playlistId: string) => {
    setLoadingTracks(true)
    try {
      const response = await fetch(`/api/spotify/tracks/${playlistId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tracks')
      }

      const data = await response.json()
      const tracks = data.items.map((item: { track: SpotifyTrack }) => item.track).filter(Boolean)
      setPlaylistTracks(tracks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks')
    } finally {
      setLoadingTracks(false)
    }
  }

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    setSelectedPlaylist(playlist)
    await fetchPlaylistTracks(playlist.id)
  }

  const handleProceedToYouTube = () => {
    if (selectedPlaylist && playlistTracks.length > 0) {
      saveSelectedPlaylistData(selectedPlaylist, playlistTracks)
      signOut({ callbackUrl: '/' }) // Sign out of Spotify, redirect to home for YouTube auth
    }
  }

  if (session?.provider !== 'spotify') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Authentication Error</h2>
        <p className="text-white/80">Please sign in with Spotify first.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Step 2: Select a Playlist
        </h2>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {!isLoading && !error && spotifyPlaylists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {spotifyPlaylists.map((playlist: SpotifyPlaylist) => (
            <div
              key={playlist.id}
              className={`bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border ${
                selectedPlaylist?.id === playlist.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-white/10'
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() => handlePlaylistSelect(playlist)}
              >
                {playlist.images?.[0] ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">No Image</div>
                  </div>
                )}
                <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
                <p className="text-white/60 text-sm">{playlist.tracks.total} tracks</p>
                <p className="text-white/40 text-xs">by {playlist.owner.display_name}</p>
              </div>

              {/* Show loading state for tracks */}
              {selectedPlaylist?.id === playlist.id && loadingTracks && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center py-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
                    <span className="text-white/70 text-sm">Loading tracks...</span>
                  </div>
                </div>
              )}

              {/* Show tracks preview and proceed button */}
              {selectedPlaylist?.id === playlist.id && !loadingTracks && playlistTracks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="mb-3">
                    <p className="text-white/80 text-sm mb-2">
                      ✓ {playlistTracks.length} tracks loaded
                    </p>
                    <div className="text-xs text-white/60 space-y-1">
                      {playlistTracks.slice(0, 3).map((track, index) => (
                        <div key={track.id} className="truncate">
                          {index + 1}. {track.name} - {track.artists.map(a => a.name).join(', ')}
                        </div>
                      ))}
                      {playlistTracks.length > 3 && (
                        <div className="text-white/40">
                          ... and {playlistTracks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedToYouTube();
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    🎵 Convert to YouTube Playlist
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && spotifyPlaylists.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/60">No playlists found.</p>
        </div>
      )}
    </div>
  )
}
