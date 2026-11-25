"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

interface Message {
  id: string
  sender: "customer" | "booster"
  text: string
  timestamp: Date
  senderName?: string
  senderImage?: string
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
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isBooster, setIsBooster] = useState(false)
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
    // Check if user is a booster
    const boosterRole = localStorage.getItem("isBooster")
    setIsBooster(boosterRole === "true")
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: isBooster ? "booster" : "customer",
      text: newMessage,
      timestamp: new Date(),
      senderName: isBooster ? "Rosa" : session?.user?.name || "Customer",
      senderImage: isBooster ? "/imgs/Imp/pfp impulse.png" : session?.user?.image || "",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

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
            <button
              onClick={() => router.push("/")}
              className="text-white hover:text-purple-400 transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-xl font-bold text-white">
              Chat with {isBooster ? "Customer" : "Booster"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-md animate-pulse" />
              {session?.user?.image ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="rounded-full border-2 border-purple-500 object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="relative w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-purple-500">
                  {session?.user?.name?.[0] || "U"}
                </div>
              )}
            </div>
            <span className="text-white font-semibold">{session?.user?.name || "User"}</span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="relative z-10 pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === (isBooster ? "booster" : "customer") ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-3 max-w-[70%]">
                  {message.sender !== (isBooster ? "booster" : "customer") && (
                    <div className="relative w-10 h-10 flex-shrink-0">
                      {message.senderImage ? (
                        <Image
                          src={message.senderImage}
                          alt={message.senderName || "User"}
                          fill
                          className="rounded-full border-2 border-purple-500 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-purple-500">
                          {message.senderName?.[0] || "U"}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 ${
                      message.sender === (isBooster ? "booster" : "customer")
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    <p className="text-sm mb-1 font-semibold">
                      {message.senderName || (message.sender === "booster" ? "Booster" : "Customer")}
                    </p>
                    <p>{message.text}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === (isBooster ? "booster" : "customer") && (
                    <div className="relative w-10 h-10 flex-shrink-0">
                      {message.senderImage ? (
                        <Image
                          src={message.senderImage}
                          alt={message.senderName || "User"}
                          fill
                          className="rounded-full border-2 border-purple-500 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-purple-500">
                          {message.senderName?.[0] || "U"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-purple-500/30 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 border border-purple-500/30 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
