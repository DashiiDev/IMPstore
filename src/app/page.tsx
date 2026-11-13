"use client"

import { useState } from "react"
import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAccessMessage, setShowAccessMessage] = useState(false)
  const router = useRouter()

  const games = [
    {
      id: "rocket-league",
      name: "Rocket League",
      image: "/imgs/jogos/rocket_league_steam_d94b86b9da.png",
      description: "Boosting for PC and Console"
    },
    {
      id: "rocket-league-sideswipe",
      name: "Rocket League Sideswipe",
      image: "/imgs/jogos/rlss-wide_2560x1440-12012d8c7119d135c1f5894ac2b0de07.png",
      description: "Boosting for Mobile"
    }
  ]

  const handleGameClick = (gameId: string) => {
    if (!session) {
      setShowAccessMessage(true)
      setTimeout(() => setShowAccessMessage(false), 3000)
      return
    }
    router.push(`/boosting/${gameId}`)
  }

  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl shadow-purple-500/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-md animate-pulse" />
              <Image
                src="/imgs/Imp/pfp impulse.png"
                alt="IMPulse Store"
                width={50}
                height={50}
                className="relative rounded-full border-2 border-purple-500"
              />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              IMPulse Store
            </h1>
          </div>

          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-purple-500"
                  />
                )}
                <span className="text-white font-semibold">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border border-red-500/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/30"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-8 animate-gradient">
            Professional Boosting
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Rank up with professional boosting services for Rocket League and Rocket League Sideswipe.
            Fast, secure, and guaranteed results.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 text-gray-300 bg-purple-900/30 px-6 py-3 rounded-full border border-purple-500/30">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              <span className="font-semibold">100% Secure</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-purple-900/30 px-6 py-3 rounded-full border border-purple-500/30">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
              <span className="font-semibold">100% Reliable</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-purple-900/30 px-6 py-3 rounded-full border border-purple-500/30">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
              <span className="font-semibold">Very Fast</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-purple-900/30 px-6 py-3 rounded-full border border-purple-500/30">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50" />
              <span className="font-semibold">No Risk of Banishment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto relative z-10">
          <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-16">
            Available Games
          </h3>
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 group ${
                  session ? "hover:shadow-2xl hover:shadow-purple-500/30" : "hover:shadow-2xl"
                } border border-purple-500/30`}
              >
                <div className={`relative h-72 md:h-96 transition-all duration-500 ${
                  session ? "" : "grayscale opacity-50"
                } group-hover:grayscale-0 group-hover:opacity-100`}>
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h4 className="text-3xl font-bold text-white mb-3">{game.name}</h4>
                  <p className="text-gray-300 text-lg mb-4">{game.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full font-semibold shadow-lg shadow-purple-500/30">
                      Boosting
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="bg-gray-950/90 rounded-3xl p-10 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Login
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleLogin("google")}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl border border-white/20"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleLogin("discord")}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-[#5865F2]/30 hover:shadow-[#5865F2]/50 border border-[#5865F2]/30"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Continue with Discord
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
              By logging in, you agree to our terms of service
            </p>
          </div>
        </div>
      )}

      {/* Access Message */}
      {showAccessMessage && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl shadow-2xl shadow-red-500/30 animate-bounce border border-red-500/30">
          <p className="font-semibold text-lg">
            ⚠️ Please login to access boosting services
          </p>
        </div>
      )}
    </div>
  )
}
