"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  sender: "customer" | "booster" | "dev"
  text: string
  timestamp: Date
  senderName?: string
  senderImage?: string
  senderRole?: "dev" | "booster" | "customer"
  game?: string
  isProgressUpdate?: boolean
  progressData?: {
    currentRank: string
    desiredRank: string
    percentage: number
  }
}

export default function BoostingStatusPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const game = searchParams.get('game') || 'rocket-league'

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userRole, setUserRole] = useState<"dev" | "booster" | "customer">("customer")
  const [orderStatus, setOrderStatus] = useState<"pending" | "active" | "completed">("pending")
  const [progress, setProgress] = useState(0)
  const [currentRank, setCurrentRank] = useState("")
  const [desiredRank, setDesiredRank] = useState("")
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [showProgressSelector, setShowProgressSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const ranks = [
    "Bronze 1", "Bronze 2", "Bronze 3",
    "Silver 1", "Silver 2", "Silver 3",
    "Gold 1", "Gold 2", "Gold 3",
    "Platinum 1", "Platinum 2", "Platinum 3",
    "Diamond 1", "Diamond 2", "Diamond 3",
    "Champion 1", "Champion 2", "Champion 3",
    "Grand Champion", "Supersonic Legend"
  ]

  useEffect(() => {
    const isDev = localStorage.getItem("isDev") === "true"
    const isBooster = localStorage.getItem("isBooster") === "true"
    
    if (isDev) setUserRole("dev")
    else if (isBooster) setUserRole("booster")
    else setUserRole("customer")
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!supabase) return

    loadMessages()
    
    const channel = supabase
      .channel(`chat:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${orderId}`
        },
        (payload) => {
          const newMsg = payload.new as any
          const message: Message = {
            id: newMsg.id,
            sender: newMsg.sender,
            text: newMsg.text,
            timestamp: new Date(newMsg.created_at),
            senderName: newMsg.sender_name,
            senderImage: newMsg.sender_image,
            senderRole: newMsg.sender_role as "dev" | "booster" | "customer",
            game: game,
            isProgressUpdate: newMsg.is_progress_update,
            progressData: newMsg.progress_data ? JSON.parse(newMsg.progress_data) : undefined,
          }
          
          setMessages(prev => [...prev, message])
          
          if (message.isProgressUpdate && message.progressData) {
            setProgress(message.progressData.percentage)
            setCurrentRank(message.progressData.currentRank)
            setDesiredRank(message.progressData.desiredRank)
          }
        }
      )
      .subscribe()

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [orderId, game])

  const loadMessages = async () => {
    if (!supabase) return

    try {
      console.log('Loading chat for:', orderId)
      
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('chat_id', orderId)
        .maybeSingle()

      console.log('Existing chat:', existingChat, 'Error:', chatError)

      if (existingChat) {
        setOrderStatus(existingChat.status as "pending" | "active" | "completed")
      } else {
        // Create chat if it doesn't exist
        console.log('Creating new chat...')
        const { error: createError } = await supabase.from('chats').insert({
          chat_id: orderId,
          game: game,
          status: 'pending'
        })
        console.log('Create error:', createError)
      }

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', orderId)
        .order('created_at', { ascending: true })

      console.log('Messages:', messagesData)

      if (messagesData) {
        const formattedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          sender: msg.sender as "customer" | "booster" | "dev",
          text: msg.text,
          timestamp: new Date(msg.created_at),
          senderName: msg.sender_name || undefined,
          senderImage: msg.sender_image || undefined,
          senderRole: msg.sender_role as "dev" | "booster" | "customer" | undefined,
          game: game,
          isProgressUpdate: msg.is_progress_update,
          progressData: msg.progress_data ? JSON.parse(msg.progress_data) : undefined,
        }))
        setMessages(formattedMessages)
        
        // Find latest progress update
        const latestProgress = formattedMessages.filter(m => m.isProgressUpdate && m.progressData).pop()
        if (latestProgress && latestProgress.progressData) {
          setProgress(latestProgress.progressData.percentage)
          setCurrentRank(latestProgress.progressData.currentRank)
          setDesiredRank(latestProgress.progressData.desiredRank)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    if (!supabase) return

    const messageData = {
      chat_id: orderId,
      sender: userRole === "customer" ? "customer" : userRole === "booster" ? "booster" : "dev",
      text: newMessage,
      sender_name: session?.user?.name || (userRole === "booster" ? "Booster" : userRole === "dev" ? "Dev" : "Customer"),
      sender_image: session?.user?.image || "",
      sender_role: userRole,
      is_progress_update: false,
    }

    try {
      const { error } = await supabase.from('messages').insert(messageData)
      if (!error) setNewMessage("")
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAcceptOrder = async () => {
    if (!supabase) return

    console.log('Accepting order:', orderId)
    
    try {
      const { error } = await supabase.from('chats').update({ status: 'active' }).eq('chat_id', orderId)
      console.log('Update error:', error)
      
      if (!error) {
        setOrderStatus("active")
        console.log('Order accepted successfully')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleProgressUpdate = async (percentage: number, rank: string) => {
    if (!supabase) return

    const messageData = {
      chat_id: orderId,
      sender: "booster",
      text: `Progress updated to ${percentage}% - Current rank: ${rank}`,
      sender_name: session?.user?.name || "Booster",
      sender_image: session?.user?.image || "",
      sender_role: "booster",
      is_progress_update: true,
      progress_data: JSON.stringify({
        currentRank: rank,
        desiredRank: desiredRank,
        percentage: percentage,
      }),
    }

    try {
      const { error } = await supabase.from('messages').insert(messageData)
      if (!error) {
        setProgress(percentage)
        setCurrentRank(rank)
        setShowProgressSelector(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getGameIcon = (game: string) => {
    if (game === "rocket-league-sideswipe") return "/imgs/RL_Sideswipe_Coverart.png"
    if (game === "rocket-league") return "/imgs/KE6nXem.png"
    return "/imgs/Imp/pfp impulse.png"
  }

  const getGameName = (game: string) => {
    if (game === "rocket-league-sideswipe") return "Rocket League Sideswipe"
    if (game === "rocket-league") return "Rocket League"
    return "Game"
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="h-14 bg-[#111111] border-b border-[#222222] px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <Image
              src={getGameIcon(game)}
              alt="Game"
              width={32}
              height={32}
              className="rounded"
              unoptimized
            />
            <div>
              <p className="text-white font-semibold text-sm">{getGameName(game)} Boosting</p>
              <p className="text-gray-400 text-xs">Order #{orderId.slice(0, 8)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
            orderStatus === "pending" ? "bg-yellow-600" : 
            orderStatus === "active" ? "bg-green-600" : "bg-gray-600"
          }`}>
            {orderStatus.toUpperCase()}
          </span>
          {userRole !== "customer" && (
            <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-red-500 to-red-700">
              BOOSTER
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Progress */}
        <div className={`w-96 bg-[#111111] border-r border-[#222222] flex flex-col ${isChatMinimized ? 'hidden' : ''}`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Boost Progress</h2>
            
            {orderStatus === "pending" && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-yellow-500 font-semibold mb-2">Awaiting Booster</p>
                <p className="text-gray-400 text-sm">Your order is pending until a booster accepts it</p>
                {userRole === "booster" && (
                  <button
                    onClick={handleAcceptOrder}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold transition-colors"
                  >
                    Accept Order
                  </button>
                )}
              </div>
            )}

            {orderStatus === "active" && (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Progress</span>
                    <span className="text-white font-semibold">{progress}%</span>
                  </div>
                  <div className="h-4 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Current Rank */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Current Rank</p>
                  <p className="text-white font-semibold text-lg">{currentRank || "Not started"}</p>
                </div>

                {/* Desired Rank */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Desired Rank</p>
                  <p className="text-green-400 font-semibold text-lg">{desiredRank || "Not set"}</p>
                </div>

                {userRole === "booster" && (
                  <button
                    onClick={() => setShowProgressSelector(!showProgressSelector)}
                    className="w-full py-3 bg-[#2b2d31] hover:bg-[#404249] text-white rounded-lg font-semibold transition-colors"
                  >
                    Update Progress
                  </button>
                )}

                {showProgressSelector && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Current Rank</label>
                      <select
                        value={currentRank}
                        onChange={(e) => setCurrentRank(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none"
                      >
                        {ranks.map(rank => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Progress %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#404249] focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleProgressUpdate(progress, currentRank)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Send Update
                    </button>
                  </div>
                )}
              </div>
            )}

            {orderStatus === "completed" && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-500 font-semibold mb-2">Boost Completed!</p>
                <p className="text-gray-400 text-sm">Your boost has been successfully completed</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className={`flex-1 flex flex-col ${isChatMinimized ? 'w-full' : ''}`}>
          {/* Chat Header */}
          <div className="h-12 bg-[#111111] border-b border-[#222222] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">Chat with Booster</span>
            </div>
            <button
              onClick={() => setIsChatMinimized(!isChatMinimized)}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              {isChatMinimized ? (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No messages yet</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${message.sender === userRole ? "bg-[#1a1a1a]" : "hover:bg-[#111111]"}`}>
                  <div className="relative w-8 h-8 flex-shrink-0">
                    {message.senderImage ? (
                      <Image
                        src={message.senderImage}
                        alt={message.senderName || "User"}
                        fill
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {message.senderName?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-xs text-white">
                        {message.senderName || (message.sender === "booster" ? "Booster" : message.sender === "dev" ? "Dev" : "Customer")}
                      </span>
                      <span className="text-gray-500 text-[10px] ml-auto">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {message.isProgressUpdate && message.progressData ? (
                      <div className="bg-purple-600/20 border border-purple-600/50 rounded-lg p-3 mt-2">
                        <p className="text-purple-400 text-xs font-semibold mb-1">Progress Update</p>
                        <p className="text-white text-sm">{message.text}</p>
                        <div className="mt-2 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                            style={{ width: `${message.progressData.percentage}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-200 text-sm">{message.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 bg-[#111111] border-t border-[#222222]">
            <div className="bg-[#1a1a1a] rounded-lg flex items-center px-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white px-2 py-2 focus:outline-none text-sm"
                disabled={orderStatus === "pending" && userRole === "customer"}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                disabled={orderStatus === "pending" && userRole === "customer"}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            {orderStatus === "pending" && userRole === "customer" && (
              <p className="text-gray-500 text-xs mt-2 text-center">Chat will be available when booster accepts the order</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
