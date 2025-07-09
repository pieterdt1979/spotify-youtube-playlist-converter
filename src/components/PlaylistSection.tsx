"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { usePlaylistStore } from "@/store/playlistStore"
import type { SpotifyPlaylist } from "@/types"

export function PlaylistSection() {
  const { data: session } = useSession()
  const {
    spotifyPlaylists,
    isLoading,
    error,
    setSpotifyPlaylists,
    setSelectedPlaylist,
    setLoading,
    setError,
  } = usePlaylistStore()

  const [needsSpotify, setNeedsSpotify] = useState(false)
  const [needsYoutube, setNeedsYoutube] = useState(false)

  useEffect(() => {
    // For now, we'll handle one provider at a time
    // In a full implementation, you'd need to store multiple tokens
    if (session) {
      setNeedsSpotify(session.provider !== 'spotify')
      setNeedsYoutube(session.provider !== 'google')
    } else {
      setNeedsSpotify(true)
      setNeedsYoutube(true)
    }
  }, [session])

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

  if (needsSpotify && needsYoutube) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-white/80 mb-6">
            Please sign in with both Spotify and YouTube to continue.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">
          Your Spotify Playlists
        </h2>

        {session?.provider !== 'spotify' && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200">
              Please sign in with Spotify to view your playlists.
            </p>
          </div>
        )}

        {session?.provider !== 'google' && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">
              YouTube authentication required for playlist conversion.
            </p>
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spotifyPlaylists.map((playlist: SpotifyPlaylist) => (
              <div
                key={playlist.id}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
                onClick={() => setSelectedPlaylist(playlist)}
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
            ))}
          </div>
        )}

        {!isLoading && !error && spotifyPlaylists.length === 0 && session?.provider === 'spotify' && (
          <div className="text-center py-8">
            <p className="text-white/60">No playlists found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
