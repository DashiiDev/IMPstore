"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Client {
  id: string
  name: string
  game: string
  status: "pending" | "active" | "completed"
  lastMessage: string
}

export default function BoosterPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isBooster, setIsBooster] = useState(false)
  const [selectedGame, setSelectedGame] = useState("rocket-league")
  const [activeTab, setActiveTab] = useState<"chats" | "orders" | "profile">("chats")
  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "Customer1", game: "rocket-league", status: "active", lastMessage: "When can you start?" },
    { id: "2", name: "Customer2", game: "rocket-league-sideswipe", status: "pending", lastMessage: "Need boosting from Bronze to Diamond" },
    { id: "3", name: "Customer3", game: "rocket-league", status: "completed", lastMessage: "Thanks for the boost!" },
  ])

  useEffect(() => {
    const boosterStatus = localStorage.getItem("isBooster")
    if (boosterStatus !== "true") {
      router.push("/")
    } else {
      setIsBooster(true)
    }
  }, [router])

  const getGameIcon = (game: string) => {
    if (game === "rocket-league") return "🚗"
    if (game === "rocket-league-sideswipe") return "📱"
    return "🎮"
  }

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-600"
    if (status === "pending") return "bg-yellow-600"
    return "bg-gray-600"
  }

  if (!isBooster) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#313338]">
      {/* Header */}
      <div className="h-12 bg-[#313338] border-b border-[#1f2023] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 font-bold text-xl">
            BOOSTER PANEL
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#2b2d31] px-3 py-1 rounded-lg border border-[#1f2023]">
            <span className="text-lg">{getGameIcon(selectedGame)}</span>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none text-sm"
            >
              <option value="rocket-league">Rocket League</option>
              <option value="rocket-league-sideswipe">Rocket League Sideswipe</option>
            </select>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
            ⚡
          </div>
          <span className="text-white font-semibold">{session?.user?.name}</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#2b2d31] min-h-screen p-4 border-r border-[#1f2023]">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("chats")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "chats" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              💬 Client Chats
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "orders" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              📋 Active Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "profile" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              👤 My Profile
            </button>
          </nav>

          {/* Stats */}
          <div className="mt-8 p-4 bg-[#1f2023] rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Stats</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Completed</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">In Progress</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Earnings</span>
                <span className="text-green-400 font-semibold">$127.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "chats" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Client Chats</h2>
              <div className="space-y-3">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => router.push(`/chat/chat-${client.id}`)}
                    className="flex items-center gap-4 p-4 bg-[#2b2d31] rounded-lg cursor-pointer hover:bg-[#404249] transition-colors border border-[#1f2023]"
                  >
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {client.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{client.name}</p>
                        <span className="text-lg">{getGameIcon(client.game)}</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate">{client.lastMessage}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Active Orders</h2>
              <div className="space-y-4">
                <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                      <div>
                        <p className="text-white font-semibold">Customer1</p>
                        <p className="text-gray-400 text-sm">RL: Bronze → Champion</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold transition-colors">
                      Start Boost
                    </button>
                    <button className="px-4 py-2 bg-[#404249] hover:bg-[#4f545c] text-white rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                      <div>
                        <p className="text-white font-semibold">Customer2</p>
                        <p className="text-gray-400 text-sm">RLSS: Silver → Diamond</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full">Pending</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold transition-colors">
                      Accept Order
                    </button>
                    <button className="px-4 py-2 bg-[#404249] hover:bg-[#4f545c] text-white rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>
              <div className="bg-[#2b2d31] rounded-lg p-6 border border-[#1f2023]">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {session?.user?.name?.[0] || "B"}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{session?.user?.name}</p>
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-bold rounded-md mt-2 inline-block">
                      BOOSTER
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Selected Game</label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full bg-[#1f2023] text-white px-4 py-3 rounded-lg border border-[#404249] focus:border-red-500 focus:outline-none"
                    >
                      <option value="rocket-league">🚗 Rocket League</option>
                      <option value="rocket-league-sideswipe">📱 Rocket League Sideswipe</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Status</label>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-semibold">Online - Accepting Orders</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1f2023]">
                    <button className="w-full py-3 bg-[#404249] hover:bg-[#4f545c] text-white rounded-lg font-semibold transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
