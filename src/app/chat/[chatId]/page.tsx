"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

interface Message {
  id: string
  sender: "customer" | "booster" | "dev"
  text: string
  timestamp: Date
  senderName?: string
  senderImage?: string
  senderRole?: "dev" | "booster" | "customer"
  game?: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const chatId = params.chatId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userRole, setUserRole] = useState<"dev" | "booster" | "customer">("customer")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Check user role
    const isDev = localStorage.getItem("isDev") === "true"
    const isBooster = localStorage.getItem("isBooster") === "true"
    
    if (isDev) setUserRole("dev")
    else if (isBooster) setUserRole("booster")
    else setUserRole("customer")
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: userRole === "customer" ? "customer" : userRole === "booster" ? "booster" : "dev",
      text: newMessage,
      timestamp: new Date(),
      senderName: userRole === "dev" ? "Dev" : userRole === "booster" ? "Rosa" : session?.user?.name || "Customer",
      senderImage: userRole === "dev" || userRole === "booster" ? "/imgs/Imp/pfp impulse.png" : session?.user?.image || "",
      senderRole: userRole,
      game: chatId.includes("rocket-league-sideswipe") ? "rocket-league-sideswipe" : "rocket-league",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const getRoleGradient = (role: string) => {
    if (role === "dev") return "bg-gradient-to-r from-pink-500 to-purple-600"
    if (role === "booster") return "bg-gradient-to-r from-red-500 to-red-700"
    return "bg-purple-600"
  }

  const getRoleBadge = (role: string) => {
    if (role === "dev") return "DEV"
    if (role === "booster") return "BOOSTER"
    return ""
  }

  const getGameIcon = (game: string) => {
    if (game === "rocket-league") return "/imgs/KE6nXem.png"
    if (game === "rocket-league-sideswipe") return "/imgs/RL_Sideswipe_Coverart.png"
    return "/imgs/Imp/pfp impulse.png"
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar - Clean design inspired by EL DORADO */}
      <div className="w-80 bg-[#111111] flex flex-col border-r border-[#222222]">
        <div className="p-6 border-b border-[#222222]">
          <h2 className="text-white font-bold text-xl">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {/* Empty state - no fake chats */}
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No active conversations</p>
            <p className="text-gray-600 text-xs mt-2">Chat will appear after purchase</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area - EL DORADO inspired design */}
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        {/* Chat Header */}
        <div className="h-16 bg-[#111111] border-b border-[#222222] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0] || "U"}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111111]" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{session?.user?.name || "User"}</p>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={getGameIcon(chatId.includes("rocket-league-sideswipe") ? "rocket-league-sideswipe" : "rocket-league")}
                  alt="Game"
                  width={20}
                  height={20}
                  className="rounded"
                  unoptimized
                />
                <p className="text-gray-400 text-xs">
                  {chatId.includes("rocket-league-sideswipe") ? "Rocket League Sideswipe" : "Rocket League"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userRole !== "customer" && (
              <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${getRoleGradient(userRole)}`}>
                {getRoleBadge(userRole)}
              </span>
            )}
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Start the conversation</p>
              <p className="text-gray-600 text-sm mt-2">Send a message to begin</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start gap-4 hover:bg-[#111111] p-4 rounded-xl transition-colors">
                <div className="relative w-12 h-12 flex-shrink-0">
                  {message.senderImage ? (
                    <Image
                      src={message.senderImage}
                      alt={message.senderName || "User"}
                      fill
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {message.senderName?.[0] || "U"}
                    </div>
                  )}
                  {message.senderRole === "booster" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-700 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                  )}
                  {message.senderRole === "dev" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                      <span className="text-white text-xs">👑</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${getRoleGradient(message.senderRole || "customer")} bg-clip-text text-transparent`}>
                      {message.senderName || (message.sender === "booster" ? "Booster" : message.sender === "dev" ? "Dev" : "Customer")}
                    </span>
                    {getRoleBadge(message.senderRole || "") && (
                      <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-md ${getRoleGradient(message.senderRole || "")}`}>
                        {getRoleBadge(message.senderRole || "")}
                      </span>
                    )}
                    {message.game && (
                      <Image
                        src={getGameIcon(message.game)}
                        alt="Game"
                        width={16}
                        height={16}
                        className="rounded"
                        unoptimized
                      />
                    )}
                    <span className="text-gray-500 text-xs ml-auto">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{message.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 bg-[#111111] border-t border-[#222222]">
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-4">
            <button className="p-2 hover:bg-[#222222] rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#222222] rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
