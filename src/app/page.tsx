"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { usePlaylistStore } from "@/store/playlistStore"
import { Header } from "@/components/Header"
import { WorkflowManager } from "@/components/WorkflowManager"

export default function Home() {
  const { status } = useSession()
  const { clearState } = usePlaylistStore()

  useEffect(() => {
    if (status === 'unauthenticated') {
      clearState()
    }
  }, [status, clearState])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-red-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-red-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <WorkflowManager />
      </main>
    </div>
  )
}
