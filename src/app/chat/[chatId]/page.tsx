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
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const chatId = params.chatId as string

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "booster",
      text: "Hello! I'm your booster. I'll be working on your rank boost. Feel free to ask any questions!",
      timestamp: new Date(),
      senderName: "Rosa",
      senderImage: "/imgs/Imp/pfp impulse.png",
      senderRole: "booster",
    },
  ])
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#313338] flex">
      {/* Sidebar - Chat List */}
      <div className="w-72 bg-[#2b2d31] flex flex-col border-r border-[#1f2023]">
        <div className="p-4 border-b border-[#1f2023]">
          <h2 className="text-white font-semibold text-lg">Direct Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Active Chat */}
          <div className="bg-[#404249] rounded-lg p-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2b2d31]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">Customer Support</p>
                <p className="text-gray-400 text-sm truncate">Boosting chat</p>
              </div>
            </div>
          </div>
          
          {/* Other Chats */}
          <div className="hover:bg-[#404249] rounded-lg p-3 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#2b2d31]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 font-semibold truncate">Staff Chat</p>
                <p className="text-gray-500 text-sm truncate">Internal communications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#313338]">
        {/* Chat Header */}
        <div className="h-12 bg-[#313338] border-b border-[#1f2023] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#313338]" />
            </div>
            <div>
              <p className="text-white font-semibold">Customer Support</p>
              <p className="text-gray-400 text-xs">Boosting Service</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#404249] rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-4 hover:bg-[#2e3035] p-2 rounded-lg transition-colors">
              <div className="relative w-10 h-10 flex-shrink-0">
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
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-700 rounded-full border-2 border-[#313338] flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                )}
                {message.senderRole === "dev" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full border-2 border-[#313338] flex items-center justify-center">
                    <span className="text-white text-xs">👑</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${getRoleGradient(message.senderRole || "customer")} bg-clip-text text-transparent`}>
                    {message.senderName || (message.sender === "booster" ? "Booster" : message.sender === "dev" ? "Dev" : "Customer")}
                  </span>
                  {getRoleBadge(message.senderRole || "") && (
                    <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-md ${getRoleGradient(message.senderRole || "")}`}>
                      {getRoleBadge(message.senderRole || "")}
                    </span>
                  )}
                  <span className="text-gray-500 text-xs">
                    {new Date(message.timestamp).toLocaleDateString()} at {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-200 mt-1">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-[#313338]">
          <div className="bg-[#383a40] rounded-lg flex items-center px-4">
            <button className="p-2 hover:bg-[#404249] rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message #boosting"
              className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#404249] rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 hover:bg-[#404249] rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
