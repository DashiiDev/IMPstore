"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface Client {
  id: string
  name: string
  game: string
  status: "pending" | "active" | "completed"
  lastMessage: string
  lastMessageTime?: Date
  unread?: number
}

export default function BoosterPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isBooster, setIsBooster] = useState(false)
  const [selectedGame, setSelectedGame] = useState("rocket-league")
  const [activeTab, setActiveTab] = useState<"chats" | "orders" | "profile">("chats")
  const [clients, setClients] = useState<Client[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const boosterStatus = localStorage.getItem("isBooster")
    if (boosterStatus !== "true") {
      router.push("/")
    } else {
      setIsBooster(true)
    }
  }, [router])

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase is not configured')
      setIsLoading(false)
      return
    }

    // Load clients from Supabase
    loadClients()
    
    // Subscribe to new chats
    const channel = supabase
      .channel('chats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        () => loadClients()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => loadClients()
      )
      .subscribe()

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const loadClients = async () => {
    if (!supabase) {
      console.error('Supabase is not configured')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Get all chats
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false })

      if (chatsError) {
        console.error('Error loading chats:', chatsError)
        return
      }

      if (!chatsData || chatsData.length === 0) {
        setClients([])
        setIsLoading(false)
        return
      }

      // Get last message for each chat
      const clientList: Client[] = await Promise.all(
        chatsData.map(async (chat) => {
          const { data: messagesData } = await supabase!
            .from('messages')
            .select('*')
            .eq('chat_id', chat.chat_id)
            .order('created_at', { ascending: false })
            .limit(1)

          const lastMsg = messagesData && messagesData.length > 0 ? messagesData[0] : null
          
          return {
            id: chat.chat_id,
            name: lastMsg?.sender_name || "Customer",
            game: chat.game,
            status: chat.status as "pending" | "active" | "completed",
            lastMessage: lastMsg?.text || "No messages yet",
            lastMessageTime: lastMsg ? new Date(lastMsg.created_at) : new Date(chat.created_at),
            unread: 0,
          }
        })
      )

      setClients(clientList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGameIcon = (game: string) => {
    if (game === "rocket-league") return "/imgs/KE6nXem.png"
    if (game === "rocket-league-sideswipe") return "/imgs/RL_Sideswipe_Coverart.png"
    return "/imgs/Imp/pfp impulse.png"
  }

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-600"
    if (status === "pending") return "bg-yellow-600"
    return "bg-gray-600"
  }

  const handleDeleteChat = async (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!supabase) return
    try {
      await supabase.from('chats').delete().eq('chat_id', clientId)
      setClients(clients.filter(c => c.id !== clientId))
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleCloseChat = async (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!supabase) return
    
    if (!confirm("Are you sure you want to close this chat? The customer will still be able to access it, but it will be marked as completed.")) {
      return
    }
    
    try {
      await supabase.from('chats').update({ status: 'completed' }).eq('chat_id', clientId)
      setClients(clients.map(c => 
        c.id === clientId ? { ...c, status: "completed" } : c
      ))
    } catch (error) {
      console.error('Error closing chat:', error)
    }
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
      <div className="h-12 bg-[#313338] border-b border-[#1f2023] px-4 flex items-center justify-between sticky top-0 z-10">
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
            <Image
              src={getGameIcon(selectedGame)}
              alt="Game"
              width={20}
              height={20}
              className="rounded"
              unoptimized
            />
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none text-sm"
            >
              <option value="rocket-league">Rocket League</option>
              <option value="rocket-league-sideswipe">Rocket League Sideswipe</option>
            </select>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            ⚡
          </div>
          <span className="text-white font-semibold text-sm">{session?.user?.name}</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 bg-[#2b2d31] min-h-screen p-3 border-r border-[#1f2023]">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("chats")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === "chats" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              💬 Client Chats
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === "orders" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              📋 Active Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === "profile" ? "bg-[#404249] text-white" : "text-gray-400 hover:bg-[#404249] hover:text-white"
              }`}
            >
              👤 My Profile
            </button>
          </nav>

          {/* Stats */}
          <div className="mt-6 p-3 bg-[#1f2023] rounded-lg">
            <p className="text-gray-400 text-xs mb-2">Stats</p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-300 text-xs">Completed</span>
                <span className="text-white font-semibold text-xs">{clients.filter(c => c.status === "completed").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-xs">In Progress</span>
                <span className="text-white font-semibold text-xs">{clients.filter(c => c.status === "active").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-xs">Earnings</span>
                <span className="text-green-400 font-semibold text-xs">${(clients.filter(c => c.status === "completed").length * 10.50).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {activeTab === "chats" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Client Chats</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">Loading chats...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#1f2023] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No active conversations</p>
                  <p className="text-gray-600 text-xs mt-2">Chats will appear after customers make purchases</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => router.push(`/boosting-status/${client.id}?game=${client.game}`)}
                      className="flex items-center gap-3 p-3 bg-[#2b2d31] rounded-lg cursor-pointer hover:bg-[#404249] transition-colors border border-[#1f2023] relative"
                    >
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {client.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm truncate">{client.name}</p>
                          <Image
                            src={getGameIcon(client.game)}
                            alt="Game"
                            width={16}
                            height={16}
                            className="rounded flex-shrink-0"
                            unoptimized
                          />
                        </div>
                        <p className="text-gray-400 text-xs truncate">{client.lastMessage}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => handleCloseChat(client.id, e)}
                          className="p-1.5 hover:bg-[#1f2023] rounded transition-colors"
                          title="Close chat"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(client.id, e)}
                          className="p-1.5 hover:bg-red-900/30 rounded transition-colors"
                          title="Delete chat"
                        >
                          <svg className="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Active Orders</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">Loading orders...</p>
                </div>
              ) : clients.filter(c => c.status === "active" || c.status === "pending").length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">No active orders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.filter(c => c.status === "active" || c.status === "pending").map((client) => (
                    <div key={client.id} className="bg-[#2b2d31] rounded-lg p-4 border border-[#1f2023]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {client.name[0]}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{client.name}</p>
                            <p className="text-gray-400 text-xs">{client.game === "rocket-league-sideswipe" ? "RLSS" : "RL"} Boosting</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/boosting-status/${client.id}?game=${client.game}`)}
                          className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold transition-colors text-sm"
                        >
                          {client.status === "pending" ? "Accept Order" : "Start Boost"}
                        </button>
                        <button 
                          onClick={() => router.push(`/boosting-status/${client.id}?game=${client.game}`)}
                          className="px-3 py-2 bg-[#404249] hover:bg-[#4f545c] text-white rounded-lg transition-colors text-sm"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">My Profile</h2>
              <div className="bg-[#2b2d31] rounded-lg p-4 border border-[#1f2023]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {session?.user?.name?.[0] || "B"}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{session?.user?.name}</p>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold rounded-md mt-1 inline-block">
                      BOOSTER
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Selected Game</label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full bg-[#1f2023] text-white px-3 py-2 rounded-lg border border-[#404249] focus:border-red-500 focus:outline-none text-sm"
                    >
                      <option value="rocket-league">🚗 Rocket League</option>
                      <option value="rocket-league-sideswipe">📱 Rocket League Sideswipe</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Status</label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-semibold text-sm">Online - Accepting Orders</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1f2023]">
                    <button className="w-full py-2 bg-[#404249] hover:bg-[#4f545c] text-white rounded-lg font-semibold transition-colors text-sm">
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
