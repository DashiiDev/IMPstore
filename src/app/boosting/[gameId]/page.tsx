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
    GC: 15,
    SSL: 20,
  },
  "2v2": {
    Bronze: 16,
    Silver: 14,
    Gold: 12,
    Platinum: 10,
    Diamond: 8,
    Champion: 6,
    GC: 12,
    SSL: 15,
  },
  "Hoops": {
    Bronze: 14,
    Silver: 12,
    Gold: 10,
    Platinum: 8,
    Diamond: 6,
    Champion: 4,
    GC: 10,
    SSL: 12,
  },
}

const extraServices = {
  "No extra service": 0,
  "Top 50 Mundial": 30,
  "Top 10 Mundial": 40,
  "Top 1 Mundial": 75,
  "Play with Booster": 6,
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

    const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Champion", "GC", "SSL"]
    
    // Extract base rank name (Bronze, Silver, etc.)
    const currentBaseRank = currentRank.split(" ")[0]
    const desiredBaseRank = desiredRank.split(" ")[0]

    console.log("Price calculation debug:", { 
      currentRank, 
      desiredRank, 
      currentBaseRank, 
      desiredBaseRank,
      mode, 
      selectedExtra 
    })

    const currentIndex = rankOrder.indexOf(currentBaseRank)
    const desiredIndex = rankOrder.indexOf(desiredBaseRank)

    console.log("Indices:", { currentIndex, desiredIndex })

    if (currentIndex === -1 || desiredIndex === -1) {
      console.error("Invalid rank name found")
      return 0
    }

    if (currentIndex >= desiredIndex) {
      console.log("Current rank is same or higher than desired rank")
      return 0
    }

    let basePrice = 0
    for (let i = currentIndex; i < desiredIndex; i++) {
      const modePrices = prices[mode as keyof typeof prices]
      const rankName = rankOrder[i]
      const rankPrice = modePrices[rankName as keyof typeof modePrices]
      console.log(`Adding price for ${rankName} in ${mode}: ${rankPrice}`)
      basePrice += rankPrice
    }

    const extrasPrice = selectedExtra ? extraServices[selectedExtra as keyof typeof extraServices] : 0

    console.log("Final price:", { basePrice, extrasPrice, total: basePrice + extrasPrice })

    return basePrice + extrasPrice
  }

  const totalPrice = calculatePrice()

  const handlePurchase = async () => {
    console.log("Purchase clicked:", { totalPrice, currentRank, desiredRank, mode, selectedExtra })
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          boostingDetails: {
            serviceName: `${game.name} Boosting`,
            description: `Boost from ${currentRank} to ${desiredRank} in ${mode} mode${selectedExtra ? ` with ${selectedExtra}` : ""}`,
            gameId: gameId,
            currentRank,
            desiredRank,
            mode,
            extraService: selectedExtra,
          },
        }),
      })

      const data = await response.json()
      console.log("Checkout response:", data)

      if (!response.ok) {
        console.error("Checkout error:", data)
        alert(data.error || "Failed to create checkout session")
        return
      }

      const { sessionId } = data

      // Redirect to Stripe Checkout using window.location
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
    } catch (error) {
      console.error("Purchase error:", error)
      alert("Failed to initiate checkout")
    }
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
              className="relative p-2 bg-purple-900/30 hover:bg-purple-800/50 rounded-full border border-purple-500/30 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all duration-300 font-semibold border border-green-500/30"
            >
              Become a Booster
            </button>
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
                      {rank.name}
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
                      {rank.name}
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(extraServices)
                  .filter(([service]) => service !== "Play with Booster" || mode !== "1v1")
                  .map(([service, price]) => (
                    <div
                      key={service}
                      onClick={() => handleExtraSelect(service)}
                      className={`relative aspect-square rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 flex flex-col items-center justify-center ${
                        selectedExtra === service
                          ? "border-purple-500 bg-purple-900/50"
                          : "border-transparent hover:border-purple-500/50 bg-gray-900/50"
                      }`}
                    >
                      <span className="text-white font-semibold text-center text-sm mb-2">{service}</span>
                      <span className="text-purple-300 font-bold text-lg">${price}$</span>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* Available Boosters */}
          <section className="py-8 px-4 relative">
            <div className="container mx-auto relative z-10 max-w-3xl">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-8">
                Available Boosters
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mb-2" />
                  <span className="text-white font-semibold text-sm">Booster 1</span>
                  <span className="text-green-400 text-xs">Online</span>
                </div>
                <div className="bg-gray-900/30 border-2 border-gray-500 rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-full mb-2" />
                  <span className="text-white font-semibold text-sm">Booster 2</span>
                  <span className="text-gray-400 text-xs">Offline</span>
                </div>
                <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mb-2" />
                  <span className="text-white font-semibold text-sm">Booster 3</span>
                  <span className="text-green-400 text-xs">Online</span>
                </div>
                <div className="bg-gray-900/30 border-2 border-gray-500 rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-full mb-2" />
                  <span className="text-white font-semibold text-sm">Booster 4</span>
                  <span className="text-gray-400 text-xs">Offline</span>
                </div>
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
                    ${totalPrice || 0}
                  </p>
                </div>
                {totalPrice === 0 && (
                  <p className="text-yellow-400 text-sm mb-4">
                    Please select current rank, desired rank, and mode to see the price
                  </p>
                )}
                <button
                  onClick={handlePurchase}
                  disabled={totalPrice === 0}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
