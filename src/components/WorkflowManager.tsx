"use client"

import { useSession } from "next-auth/react"
import { usePlaylistStore } from "@/store/playlistStore"
import { SpotifyAuthStep } from "./workflow/SpotifyAuthStep"
import { PlaylistSelectionStep } from "./workflow/PlaylistSelectionStep"
import { YouTubeAuthStep } from "./workflow/YouTubeAuthStep"
import { ConversionStep } from "./workflow/ConversionStep"
import { CompleteStep } from "./workflow/CompleteStep"

export function WorkflowManager() {
  const { data: session } = useSession()
  const { currentStep, selectedPlaylistData } = usePlaylistStore()

  // Determine current step based on session and workflow state
  const getActiveStep = () => {
    // If no session, always start with spotify-auth
    if (!session) {
      return 'spotify-auth'
    }

    // If user is signed in with Spotify
    if (session.provider === 'spotify') {
      // If we have saved playlist data, they're ready for YouTube auth
      if (selectedPlaylistData.playlist && selectedPlaylistData.tracks.length > 0) {
        return 'youtube-auth'
      }
      // Otherwise, they need to select a playlist
      return 'playlist-selection'
    }

    // If user is signed in with YouTube/Google
    if (session.provider === 'google') {
      // If we have playlist data and are in conversion step, show conversion
      if (selectedPlaylistData.playlist && currentStep === 'conversion') {
        return 'conversion'
      }
      // If we have playlist data but haven't started conversion, start it
      if (selectedPlaylistData.playlist && selectedPlaylistData.tracks.length > 0) {
        return 'conversion'
      }
      // If no playlist data but signed in with Google, go back to playlist selection
      return 'spotify-auth'
    }

    // Default fallback
    return currentStep
  }

  const activeStep = getActiveStep()

  const renderStep = () => {
    switch (activeStep) {
      case 'spotify-auth':
        return <SpotifyAuthStep />
      case 'playlist-selection':
        return <PlaylistSelectionStep />
      case 'youtube-auth':
        return <YouTubeAuthStep />
      case 'conversion':
        return <ConversionStep />
      case 'complete':
        return <CompleteStep />
      default:
        return <SpotifyAuthStep />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-4">
          {[
            { step: 'spotify-auth', label: 'Spotify' },
            { step: 'playlist-selection', label: 'Select Playlist' },
            { step: 'youtube-auth', label: 'YouTube' },
            { step: 'conversion', label: 'Convert' },
            { step: 'complete', label: 'Complete' },
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  activeStep === item.step
                    ? 'bg-green-500 text-white'
                    : index < ['spotify-auth', 'playlist-selection', 'youtube-auth', 'conversion', 'complete'].indexOf(activeStep)
                    ? 'bg-green-500/50 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-white text-sm">{item.label}</span>
              {index < 4 && (
                <div className="w-8 h-0.5 bg-gray-600 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {renderStep()}
    </div>
  )
}
