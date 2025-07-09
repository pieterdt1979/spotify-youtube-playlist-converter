import "next-auth"

declare module "next-auth" {
  interface Session {
    provider?: string
    accessToken?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}

// Workflow types
export type WorkflowStep = 'spotify-auth' | 'playlist-selection' | 'youtube-auth' | 'conversion' | 'complete'

// Spotify API Types
export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  tracks: {
    total: number
    href: string
  }
  owner: {
    display_name: string
  }
  public: boolean
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyArtist {
  id: string
  name: string
  external_urls: {
    spotify: string
  }
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

// YouTube API Types
export interface YouTubePlaylist {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: YouTubeThumbnails
  }
  status: {
    privacyStatus: "private" | "public" | "unlisted"
  }
}

export interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: YouTubeThumbnails
    channelTitle: string
    publishedAt: string
  }
}

export interface YouTubeThumbnails {
  default: YouTubeThumbnail
  medium: YouTubeThumbnail
  high: YouTubeThumbnail
}

export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

// Application State Types
export interface TransferProgress {
  songTitle: string
  status: "pending" | "searching" | "found" | "added" | "failed"
  error?: string
  youtubeVideoId?: string
}

export interface PlaylistStore {
  spotifyPlaylists: SpotifyPlaylist[]
  selectedPlaylist: SpotifyPlaylist | null
  playlistTracks: SpotifyTrack[]
  transferProgress: TransferProgress[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setSpotifyPlaylists: (playlists: SpotifyPlaylist[]) => void
  setSelectedPlaylist: (playlist: SpotifyPlaylist | null) => void
  setPlaylistTracks: (tracks: SpotifyTrack[]) => void
  updateTransferProgress: (progress: TransferProgress[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearState: () => void
}
