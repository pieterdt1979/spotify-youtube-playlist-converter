import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  PlaylistStore, 
  SpotifyPlaylist, 
  SpotifyTrack, 
  TransferProgress 
} from '@/types'

// Workflow steps
export type WorkflowStep = 'spotify-auth' | 'playlist-selection' | 'youtube-auth' | 'conversion' | 'complete'

interface ExtendedPlaylistStore extends PlaylistStore {
  // Workflow state
  currentStep: WorkflowStep
  selectedPlaylistData: {
    playlist: SpotifyPlaylist | null
    tracks: SpotifyTrack[]
  }
  
  // Workflow actions
  setCurrentStep: (step: WorkflowStep) => void
  saveSelectedPlaylistData: (playlist: SpotifyPlaylist, tracks: SpotifyTrack[]) => void
  resetWorkflow: () => void
}

export const usePlaylistStore = create<ExtendedPlaylistStore>()(
  devtools(
    persist(
      (set) => ({
        // Existing state
        spotifyPlaylists: [],
        selectedPlaylist: null,
        playlistTracks: [],
        transferProgress: [],
        isLoading: false,
        error: null,

        // Workflow state
        currentStep: 'spotify-auth',
        selectedPlaylistData: {
          playlist: null,
          tracks: []
        },

        // Existing actions
        setSpotifyPlaylists: (playlists: SpotifyPlaylist[]) =>
          set({ spotifyPlaylists: playlists }, false, 'setSpotifyPlaylists'),

        setSelectedPlaylist: (playlist: SpotifyPlaylist | null) =>
          set(
            { 
              selectedPlaylist: playlist,
              playlistTracks: [], // Clear tracks when selecting new playlist
              transferProgress: [] // Clear progress
            },
            false,
            'setSelectedPlaylist'
          ),

        setPlaylistTracks: (tracks: SpotifyTrack[]) =>
          set({ playlistTracks: tracks }, false, 'setPlaylistTracks'),

        updateTransferProgress: (progress: TransferProgress[]) =>
          set({ transferProgress: progress }, false, 'updateTransferProgress'),

        setLoading: (loading: boolean) =>
          set({ isLoading: loading }, false, 'setLoading'),

        setError: (error: string | null) =>
          set({ error }, false, 'setError'),

        clearState: () =>
          set(
            {
              spotifyPlaylists: [],
              selectedPlaylist: null,
              playlistTracks: [],
              transferProgress: [],
              isLoading: false,
              error: null,
            },
            false,
            'clearState'
          ),

        // Workflow actions
        setCurrentStep: (step: WorkflowStep) =>
          set({ currentStep: step }, false, 'setCurrentStep'),

        saveSelectedPlaylistData: (playlist: SpotifyPlaylist, tracks: SpotifyTrack[]) =>
          set(
            {
              selectedPlaylistData: { playlist, tracks },
              currentStep: 'youtube-auth'
            },
            false,
            'saveSelectedPlaylistData'
          ),

        resetWorkflow: () =>
          set(
            {
              currentStep: 'spotify-auth',
              selectedPlaylistData: { playlist: null, tracks: [] },
              spotifyPlaylists: [],
              selectedPlaylist: null,
              playlistTracks: [],
              transferProgress: [],
              isLoading: false,
              error: null,
            },
            false,
            'resetWorkflow'
          ),
      }),
      {
        name: 'playlist-workflow-store',
        partialize: (state) => ({
          currentStep: state.currentStep,
          selectedPlaylistData: state.selectedPlaylistData,
          transferProgress: state.transferProgress,
        }),
      }
    ),
    {
      name: 'playlist-store',
    }
  )
)
