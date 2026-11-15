"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

interface GameData {
  id: string
  name: string
  ranks: Array<{
    name: string
    image: string
    emoji: string
  }>
}

const prices = {
  "1v1": {
    Bronze: 20,
    Silver: 18,
    Gold: 16,
    Platinum: 14,
    Diamond: 12,
    Champion: 7,
  },
  "2v2": {
    Bronze: 16,
    Silver: 14,
    Gold: 12,
    Platinum: 10,
    Diamond: 8,
    Champion: 6,
  },
  "Hoops": {
    Bronze: 14,
    Silver: 12,
    Gold: 10,
    Platinum: 8,
    Diamond: 6,
    Champion: 4,
  },
}

const extraServices = {
  "Top 50 Mundial": 30,
  "Top 10 Mundial": 40,
  "Top 1 Mundial": 75,
}

const gamesData: Record<string, GameData> = {
  "rocket-league": {
    id: "rocket-league",
    name: "Rocket League",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rl/Bronze 1 RL.png", emoji: "🥉" },
      { name: "Bronze 2", image: "/imgs/ranks/rl/Bronze 2 RL.png", emoji: "🥉" },
      { name: "Bronze 3", image: "/imgs/ranks/rl/Bronze 3 RL.png", emoji: "🥉" },
      { name: "Silver 1", image: "/imgs/ranks/rl/Silver 1 RL.png", emoji: "🥈" },
      { name: "Silver 2", image: "/imgs/ranks/rl/Silver 2 RL.png", emoji: "🥈" },
      { name: "Silver 3", image: "/imgs/ranks/rl/Silver 3 RL.png", emoji: "🥈" },
      { name: "Gold 1", image: "/imgs/ranks/rl/Gold 1 RL.png", emoji: "🥇" },
      { name: "Gold 2", image: "/imgs/ranks/rl/Gold 2 RL.png", emoji: "🥇" },
      { name: "Gold 3", image: "/imgs/ranks/rl/Gold 3 RL.png", emoji: "🥇" },
      { name: "Platinum 1", image: "/imgs/ranks/rl/Platinum 1 RL.png", emoji: "💎" },
      { name: "Platinum 2", image: "/imgs/ranks/rl/Platinum 2 RL.png", emoji: "💎" },
      { name: "Platinum 3", image: "/imgs/ranks/rl/Platinum 3 RL.png", emoji: "💎" },
      { name: "Diamond 1", image: "/imgs/ranks/rl/Diamond 1 RL.png", emoji: "💠" },
      { name: "Diamond 2", image: "/imgs/ranks/rl/Diamond 2 RL.png", emoji: "💠" },
      { name: "Diamond 3", image: "/imgs/ranks/rl/Diamond 3 RL.png", emoji: "💠" },
      { name: "Champion 1", image: "/imgs/ranks/rl/Champion 1 RL.png", emoji: "🏆" },
      { name: "Champion 2", image: "/imgs/ranks/rl/Champion 2 RL.png", emoji: "🏆" },
      { name: "Champion 3", image: "/imgs/ranks/rl/Champion 3 RL.png", emoji: "🏆" },
      { name: "GC 1", image: "/imgs/ranks/rl/GC 1 RL.png", emoji: "👑" },
      { name: "GC 2", image: "/imgs/ranks/rl/GC 2 RL.png", emoji: "👑" },
      { name: "GC 3", image: "/imgs/ranks/rl/GC 3 RL.png", emoji: "👑" },
      { name: "SSL", image: "/imgs/ranks/rl/SSL RL.png", emoji: "🏅" },
    ]
  },
  "rocket-league-sideswipe": {
    id: "rocket-league-sideswipe",
    name: "Rocket League Sideswipe",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rlss/Bronze 1.png", emoji: "🥉" },
      { name: "Bronze 2", image: "/imgs/ranks/rlss/Bronze 2.png", emoji: "🥉" },
      { name: "Bronze 3", image: "/imgs/ranks/rlss/Bronze 3.png", emoji: "🥉" },
      { name: "Bronze 4", image: "/imgs/ranks/rlss/Bronze 4.png", emoji: "🥉" },
      { name: "Bronze 5", image: "/imgs/ranks/rlss/Bronze 5.png", emoji: "🥉" },
      { name: "Silver 1", image: "/imgs/ranks/rlss/Silver 1.png", emoji: "🥈" },
      { name: "Silver 2", image: "/imgs/ranks/rlss/Silver 2.png", emoji: "🥈" },
      { name: "Silver 3", image: "/imgs/ranks/rlss/Silver 3.png", emoji: "🥈" },
      { name: "Silver 4", image: "/imgs/ranks/rlss/Silver 4.png", emoji: "🥈" },
      { name: "Silver 5", image: "/imgs/ranks/rlss/Silver 5.png", emoji: "🥈" },
      { name: "Gold 1", image: "/imgs/ranks/rlss/Gold 1.png", emoji: "🥇" },
      { name: "Gold 2", image: "/imgs/ranks/rlss/Gold 2.png", emoji: "🥇" },
      { name: "Gold 3", image: "/imgs/ranks/rlss/Gold 3.png", emoji: "🥇" },
      { name: "Gold 4", image: "/imgs/ranks/rlss/Gold 4.png", emoji: "🥇" },
      { name: "Gold 5", image: "/imgs/ranks/rlss/Gold 5.png", emoji: "🥇" },
      { name: "Platinum 1", image: "/imgs/ranks/rlss/Platinum 1.png", emoji: "💎" },
      { name: "Platinum 2", image: "/imgs/ranks/rlss/Platinum 2.png", emoji: "💎" },
      { name: "Platinum 3", image: "/imgs/ranks/rlss/Platinum 3.png", emoji: "💎" },
      { name: "Platinum 4", image: "/imgs/ranks/rlss/Platinum 4.png", emoji: "💎" },
      { name: "Platinum 5", image: "/imgs/ranks/rlss/Platinum 5.png", emoji: "💎" },
      { name: "Diamond 1", image: "/imgs/ranks/rlss/Diamond 1.png", emoji: "💠" },
      { name: "Diamond 2", image: "/imgs/ranks/rlss/Diamond 2.png", emoji: "💠" },
      { name: "Diamond 3", image: "/imgs/ranks/rlss/Diamond 3.png", emoji: "💠" },
      { name: "Diamond 4", image: "/imgs/ranks/rlss/Diamond 4.png", emoji: "💠" },
      { name: "Diamond 5", image: "/imgs/ranks/rlss/Diamond 5.png", emoji: "💠" },
      { name: "Champion 1", image: "/imgs/ranks/rlss/Champion 1.png", emoji: "🏆" },
      { name: "Champion 2", image: "/imgs/ranks/rlss/Champion 2.png", emoji: "🏆" },
      { name: "Champion 3", image: "/imgs/ranks/rlss/Champion 3.png", emoji: "🏆" },
      { name: "Champion 4", image: "/imgs/ranks/rlss/Champion 4.png", emoji: "🏆" },
      { name: "Champion 5", image: "/imgs/ranks/rlss/Champion 5.png", emoji: "🏆" },
      { name: "GC", image: "/imgs/ranks/rlss/GC.png", emoji: "👑" },
    ]
  }
}

// Filter ranks for current selection (exclude GC and above)
const currentRanks = (gameId: string) => {
  const ranks = gamesData[gameId]?.ranks || []
  return ranks.filter(rank => !rank.name.includes("GC") && !rank.name.includes("SSL"))
}

// All ranks for desired selection
const desiredRanks = (gameId: string) => {
  return gamesData[gameId]?.ranks || []
}

export default function BoostingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string

  const game = gamesData[gameId]

  const [currentRank, setCurrentRank] = useState("")
  const [desiredRank, setDesiredRank] = useState("")
  const [mode, setMode] = useState("1v1")
  const [selectedExtra, setSelectedExtra] = useState<string>("")
  const [showModeSelection, setShowModeSelection] = useState(false)

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
        <div className="relative z-10 text-center">
          <div className="text-white text-2xl font-semibold mb-4">Game not found</div>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const handleRankSelect = (rankName: string, type: "current" | "desired") => {
    if (type === "current") {
      setCurrentRank(rankName)
    } else {
      setDesiredRank(rankName)
    }
  }

  const handleModeSelect = (selectedMode: string) => {
    setMode(selectedMode)
  }

  const handleExtraSelect = (extra: string) => {
    setSelectedExtra(extra === selectedExtra ? "" : extra)
  }

  const calculatePrice = () => {
    if (!currentRank || !desiredRank) return 0

    const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Champion"]
    const currentBaseRank = currentRank.split(" ")[0]
    const desiredBaseRank = desiredRank.split(" ")[0]

    const currentIndex = rankOrder.indexOf(currentBaseRank)
    const desiredIndex = rankOrder.indexOf(desiredBaseRank)

    if (currentIndex >= desiredIndex) return 0

    let basePrice = 0
    for (let i = currentIndex; i < desiredIndex; i++) {
      const modePrices = prices[mode as keyof typeof prices]
      const rankPrice = modePrices[rankOrder[i] as keyof typeof modePrices]
      basePrice += rankPrice
    }

    const extrasPrice = selectedExtra ? extraServices[selectedExtra as keyof typeof extraServices] : 0

    return basePrice + extrasPrice
  }

  const totalPrice = calculatePrice()

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
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              IMPulse Store
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
              {session?.user?.image && (
                <div className="relative w-12 h-12">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="rounded-full border-2 border-purple-500 object-cover"
                    unoptimized
                  />
                </div>
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
      <section className="pt-40 pb-8 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
            {game.name}
          </h2>
          <p className="text-gray-300">Select your current rank and desired rank to calculate the price</p>
        </div>
      </section>

      {/* Rank Selection */}
      {!showModeSelection ? (
        <section className="py-8 px-4 relative">
          <div className="container mx-auto relative z-10 max-w-3xl">
            <div className="space-y-6">
              {/* Current Rank */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Current Rank</h3>
                <select
                  value={currentRank}
                  onChange={(e) => setCurrentRank(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select your current rank</option>
                  {currentRanks(gameId).map((rank) => (
                    <option key={rank.name} value={rank.name}>
                      {rank.emoji} {rank.name}
                    </option>
                  ))}
                </select>
                {currentRank && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <Image
                        src={game.ranks.find(r => r.name === currentRank)?.image || ""}
                        alt={currentRank}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Desired Rank */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Desired Rank</h3>
                <select
                  value={desiredRank}
                  onChange={(e) => setDesiredRank(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-pink-500/30 focus:border-pink-500 focus:outline-none"
                >
                  <option value="">Select your desired rank</option>
                  {desiredRanks(gameId).map((rank) => (
                    <option key={rank.name} value={rank.name}>
                      {rank.emoji} {rank.name}
                    </option>
                  ))}
                </select>
                {desiredRank && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <Image
                        src={game.ranks.find(r => r.name === desiredRank)?.image || ""}
                        alt={desiredRank}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {currentRank && desiredRank && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowModeSelection(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/30"
                >
                  Next: Select Mode
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Mode Selection */}
          <section className="py-8 px-4 relative">
            <div className="container mx-auto relative z-10 max-w-3xl">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-8">
                Select Mode
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {["1v1", "2v2", "Hoops"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeSelect(m)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      mode === m
                        ? "border-purple-500 bg-purple-900/50"
                        : "border-transparent hover:border-purple-500/50 bg-gray-900/50"
                    }`}
                  >
                    <p className="text-2xl font-bold text-white mb-2">{m}</p>
                    <p className="text-gray-400 text-sm">
                      ${prices[m as keyof typeof prices][currentRank.split(" ")[0] as "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Champion"]}$
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowModeSelection(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
                >
                  Back to Rank Selection
                </button>
              </div>
            </div>
          </section>

          {/* Extra Services */}
          <section className="py-8 px-4 relative">
            <div className="container mx-auto relative z-10 max-w-3xl">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-8">
                Extra Services (Optional)
              </h3>
              <div className="space-y-4">
                <div
                  onClick={() => handleExtraSelect("")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                    selectedExtra === ""
                      ? "border-purple-500 bg-purple-900/50"
                      : "border-transparent hover:border-purple-500/50 bg-gray-900/50"
                  }`}
                >
                  <span className="text-white font-semibold">No extra service</span>
                  <span className="text-gray-400 font-bold">$0</span>
                </div>
                {Object.entries(extraServices).map(([service, price]) => (
                  <div
                    key={service}
                    onClick={() => handleExtraSelect(service)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                      selectedExtra === service
                        ? "border-purple-500 bg-purple-900/50"
                        : "border-transparent hover:border-purple-500/50 bg-gray-900/50"
                    }`}
                  >
                    <span className="text-white font-semibold">{service}</span>
                    <span className="text-purple-300 font-bold">${price}$</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Total Price */}
          <section className="py-8 px-4 relative">
            <div className="container mx-auto relative z-10 max-w-3xl">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold text-white">Total</h3>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    ${totalPrice}$
                  </p>
                </div>
                <button
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/30"
                >
                  Purchase Boosting
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
