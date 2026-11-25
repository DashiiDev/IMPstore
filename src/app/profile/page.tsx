"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userRole, setUserRole] = useState<"dev" | "booster" | "customer">("customer")
  const [selectedGame, setSelectedGame] = useState("rocket-league")
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("I love Rocket League!")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    const isDev = localStorage.getItem("isDev") === "true"
    const isBooster = localStorage.getItem("isBooster") === "true"
    
    if (isDev) setUserRole("dev")
    else if (isBooster) setUserRole("booster")
    else setUserRole("customer")
  }, [])

  const getRoleGradient = (role: string) => {
    if (role === "dev") return "bg-gradient-to-r from-pink-500 to-purple-600"
    if (role === "booster") return "bg-gradient-to-r from-red-500 to-red-700"
    return "bg-purple-600"
  }

  const getGameIcon = (game: string) => {
    if (game === "rocket-league") return "🚗"
    if (game === "rocket-league-sideswipe") return "📱"
    return "🎮"
  }

  if (status === "loading") {
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
          <h1 className="text-white font-bold text-xl">User Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#404249] hover:bg-[#4f545c] text-white rounded-lg transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/20 rounded-full blur-xl" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-[#2b2d31] rounded-b-lg p-6 border border-t-0 border-[#1f2023]">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative -mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-[#2b2d31] overflow-hidden bg-[#1f2023]">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-[#2b2d31]" />
            </div>

            {/* User Info */}
            <div className="flex-1 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{session?.user?.name}</h2>
                {userRole !== "customer" && (
                  <span className={`px-3 py-1 text-sm font-bold text-white rounded-md ${getRoleGradient(userRole)}`}>
                    {userRole.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">Member since {new Date().toLocaleDateString()}</p>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-[#1f2023] text-white px-4 py-3 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Primary Game</label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full bg-[#1f2023] text-white px-4 py-3 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none"
                    >
                      <option value="rocket-league">🚗 Rocket League</option>
                      <option value="rocket-league-sideswipe">📱 Rocket League Sideswipe</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Bio</p>
                    <p className="text-gray-200">{bio}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Primary Game</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getGameIcon(selectedGame)}</span>
                        <span className="text-white font-semibold capitalize">
                          {selectedGame.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {userRole === "dev" && (
                    <button
                      onClick={() => router.push("/dev")}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Open Dev Panel
                    </button>
                  )}
                  {userRole === "booster" && (
                    <button
                      onClick={() => router.push("/booster")}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold transition-colors"
                    >
                      Open Booster Panel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Badges/Roles Section */}
          <div className="mt-8 pt-6 border-t border-[#1f2023]">
            <h3 className="text-white font-semibold mb-4">Roles & Badges</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">Member</span>
              {userRole === "dev" && (
                <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm rounded-full">👑 Developer</span>
              )}
              {userRole === "booster" && (
                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm rounded-full">⚡ Booster</span>
              )}
              <span className="px-3 py-1 bg-[#404249] text-gray-300 text-sm rounded-full">Verified Customer</span>
            </div>
          </div>

          {/* Connections */}
          <div className="mt-6 pt-6 border-t border-[#1f2023]">
            <h3 className="text-white font-semibold mb-4">Connections</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#1f2023] rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  G
                </div>
                <div>
                  <p className="text-white font-semibold">Google</p>
                  <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-green-600 text-white text-xs rounded-full">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
