"use client"

import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">
            Spotify ➜ YouTube
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {session && (
            <>
              <div className="text-white/80 text-sm">
                Welcome, {session.user?.name || session.user?.email}
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
