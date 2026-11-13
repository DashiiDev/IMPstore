"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

interface GameData {
  id: string
  name: string
  ranks: Array<{
    name: string
    image: string
  }>
}

const gamesData: Record<string, GameData> = {
  "rocket-league": {
    id: "rocket-league",
    name: "Rocket League",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rl/Bronze 1 RL.png" },
      { name: "Bronze 2", image: "/imgs/ranks/rl/Bronze 2 RL.png" },
      { name: "Bronze 3", image: "/imgs/ranks/rl/Bronze 3 RL.png" },
      { name: "Silver 1", image: "/imgs/ranks/rl/Silver 1 RL.png" },
      { name: "Silver 2", image: "/imgs/ranks/rl/Silver 2 RL.png" },
      { name: "Silver 3", image: "/imgs/ranks/rl/Silver 3 RL.png" },
      { name: "Gold 1", image: "/imgs/ranks/rl/Gold 1 RL.png" },
      { name: "Gold 2", image: "/imgs/ranks/rl/Gold 2 RL.png" },
      { name: "Gold 3", image: "/imgs/ranks/rl/Gold 3 RL.png" },
      { name: "Platinum 1", image: "/imgs/ranks/rl/Platinum 1 RL.png" },
      { name: "Platinum 2", image: "/imgs/ranks/rl/Platinum 2 RL.png" },
      { name: "Platinum 3", image: "/imgs/ranks/rl/Platinum 3 RL.png" },
      { name: "Diamond 1", image: "/imgs/ranks/rl/Diamond 1 RL.png" },
      { name: "Diamond 2", image: "/imgs/ranks/rl/Diamond 2 RL.png" },
      { name: "Diamond 3", image: "/imgs/ranks/rl/Diamond 3 RL.png" },
      { name: "Champion 1", image: "/imgs/ranks/rl/Champion 1 RL.png" },
      { name: "Champion 2", image: "/imgs/ranks/rl/Champion 2 RL.png" },
      { name: "Champion 3", image: "/imgs/ranks/rl/Champion 3 RL.png" },
      { name: "Grand Champion 1", image: "/imgs/ranks/rl/Grand Champion 1 RL.png" },
      { name: "GC 2", image: "/imgs/ranks/rl/GC 2 RL.png" },
      { name: "GC 3", image: "/imgs/ranks/rl/GC 3 RL.png" },
      { name: "SSL", image: "/imgs/ranks/rl/SSL RL.png" },
    ]
  },
  "rocket-league-sideswipe": {
    id: "rocket-league-sideswipe",
    name: "Rocket League Sideswipe",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rlss/Bronze 1.png" },
      { name: "Bronze 2", image: "/imgs/ranks/rlss/Bronze 2.png" },
      { name: "Bronze 3", image: "/imgs/ranks/rlss/Bronze 3.png" },
      { name: "Bronze 4", image: "/imgs/ranks/rlss/Bronze 4.png" },
      { name: "Bronze 5", image: "/imgs/ranks/rlss/Bronze 5.png" },
      { name: "Silver 1", image: "/imgs/ranks/rlss/Silver 1.png" },
      { name: "Silver 2", image: "/imgs/ranks/rlss/Silver 2.png" },
      { name: "Silver 3", image: "/imgs/ranks/rlss/Silver 3.png" },
      { name: "Silver 4", image: "/imgs/ranks/rlss/Silver 4.png" },
      { name: "Silver 5", image: "/imgs/ranks/rlss/Silver 5.png" },
      { name: "Gold 1", image: "/imgs/ranks/rlss/Gold 1.png" },
      { name: "Gold 2", image: "/imgs/ranks/rlss/Gold 2.png" },
      { name: "Gold 3", image: "/imgs/ranks/rlss/Gold 3.png" },
      { name: "Gold 4", image: "/imgs/ranks/rlss/Gold 4.png" },
      { name: "Gold 5", image: "/imgs/ranks/rlss/Gold 5.png" },
      { name: "Platinum 1", image: "/imgs/ranks/rlss/Platinum 1.png" },
      { name: "Platinum 2", image: "/imgs/ranks/rlss/Platinum 2.png" },
      { name: "Platinum 3", image: "/imgs/ranks/rlss/Platinum 3.png" },
      { name: "Platinum 4", image: "/imgs/ranks/rlss/Platinum 4.png" },
      { name: "Platinum 5", image: "/imgs/ranks/rlss/Platinum 5.png" },
      { name: "Diamond 1", image: "/imgs/ranks/rlss/Diamond 1.png" },
      { name: "Diamond 2", image: "/imgs/ranks/rlss/Diamond 2.png" },
      { name: "Diamond 3", image: "/imgs/ranks/rlss/Diamond 3.png" },
      { name: "Diamond 4", image: "/imgs/ranks/rlss/Diamond 4.png" },
      { name: "Diamond 5", image: "/imgs/ranks/rlss/Diamond 5.png" },
      { name: "Champion 1", image: "/imgs/ranks/rlss/Champion 1.png" },
      { name: "Champion 2", image: "/imgs/ranks/rlss/Champion 2.png" },
      { name: "Champion 3", image: "/imgs/ranks/rlss/Champion 3.png" },
      { name: "Champion 4", image: "/imgs/ranks/rlss/Champion 4.png" },
      { name: "Champion 5", image: "/imgs/ranks/rlss/Champion 5.png" },
      { name: "GC", image: "/imgs/ranks/rlss/GC.png" },
    ]
  }
}

export default function BoostingPage({ params }: { params: { gameId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const game = gamesData[params.gameId]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 text-white text-2xl font-semibold">Game not found</div>
      </div>
    )
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-purple-500"
                />
              )}
              <span className="text-white font-semibold">{session?.user?.name}</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 border border-purple-500/30"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Game Header */}
      <section className="pt-40 pb-16 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6">
            {game.name}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Select your current rank and desired rank to purchase boosting services
          </p>
        </div>
      </section>

      {/* Ranks Grid */}
      <section className="py-12 px-4 relative">
        <div className="container mx-auto relative z-10">
          <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-12">
            Available Ranks
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {game.ranks.map((rank) => (
              <div
                key={rank.name}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 hover:bg-purple-900/30 transition-all duration-300 hover:scale-105 cursor-pointer border border-purple-500/30 hover:border-purple-500/60 shadow-lg hover:shadow-purple-500/20"
              >
                <div className="relative w-full aspect-square mb-3">
                  <Image
                    src={rank.image}
                    alt={rank.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-white text-center text-sm font-semibold">{rank.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-12">
            Available Services
          </h3>
          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/20">
              <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                Boosting
              </h4>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Our professional boosters play on your account to rank you up
              </p>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Secure VPN</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Optional streaming</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>High MMR boosters</span>
                </li>
              </ul>
              <button className="mt-8 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/30">
                Purchase Boosting
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
