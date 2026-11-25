"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
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
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const chatId = params.chatId as string
  const game = searchParams.get("game") || "rocket-league"

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userRole, setUserRole] = useState<"dev" | "booster" | "customer">("customer")
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Load messages from Supabase
  useEffect(() => {
    if (!supabase) {
      console.error('Supabase is not configured')
      setIsLoading(false)
      return
    }

    loadMessages()
    
    // Subscribe to new messages in real-time
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
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
          }
          
          setMessages(prev => [...prev, message])
          
          // Show notification if message is from someone else
          if (newMsg.sender !== userRole) {
            setUnreadCount(prev => prev + 1)
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("New Message", {
                body: `${newMsg.sender_name}: ${newMsg.text}`,
                icon: "/imgs/Imp/pfp impulse.png"
              })
            }
          }
        }
      )
      .subscribe()

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [chatId, userRole, game])

  const loadMessages = async () => {
    if (!supabase) {
      console.error('Supabase is not configured')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Check if chat exists, if not create it
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('chat_id', chatId)
        .single()

      if (!existingChat) {
        await supabase.from('chats').insert({
          chat_id: chatId,
          game: game,
          status: 'active'
        })
      }

      // Load messages
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
      } else if (messagesData) {
        const formattedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          sender: msg.sender as "customer" | "booster" | "dev",
          text: msg.text,
          timestamp: new Date(msg.created_at),
          senderName: msg.sender_name || undefined,
          senderImage: msg.sender_image || undefined,
          senderRole: msg.sender_role as "dev" | "booster" | "customer" | undefined,
          game: game,
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    if (!supabase) {
      console.error('Supabase is not configured')
      return
    }

    const messageData = {
      chat_id: chatId,
      sender: userRole === "customer" ? "customer" : userRole === "booster" ? "booster" : "dev",
      text: newMessage,
      sender_name: userRole === "dev" ? "Dev" : userRole === "booster" ? "Rosa" : session?.user?.name || "Customer",
      sender_image: userRole === "dev" || userRole === "booster" ? "/imgs/Imp/pfp impulse.png" : session?.user?.image || "",
      sender_role: userRole,
    }

    try {
      const { error } = await supabase.from('messages').insert(messageData)
      if (error) {
        console.error('Error sending message:', error)
      } else {
        setNewMessage("")
      }
    } catch (error) {
      console.error('Error:', error)
    }
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
    if (game === "rocket-league-sideswipe") return "/imgs/RL_Sideswipe_Coverart.png"
    if (game === "rocket-league") return "/imgs/KE6nXem.png"
    return "/imgs/Imp/pfp impulse.png"
  }

  const getGameName = (game: string) => {
    if (game === "rocket-league-sideswipe") return "Rocket League Sideswipe"
    if (game === "rocket-league") return "Rocket League"
    return "Game"
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Chat Header - Simplified */}
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
              <p className="text-white font-semibold text-sm">{getGameName(game)}</p>
              <p className="text-gray-400 text-xs">Boosting Service</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
          {userRole !== "customer" && (
            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${getRoleGradient(userRole)}`}>
              {getRoleBadge(userRole)}
            </span>
          )}
          <div className="relative">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111111]" />
          </div>
        </div>
      </div>

      {/* Messages - Simplified */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">Start the conversation</p>
            <p className="text-gray-600 text-sm mt-1">Send a message to begin</p>
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
                  <span className={`font-semibold text-xs ${getRoleGradient(message.senderRole || "customer")} bg-clip-text text-transparent`}>
                    {message.senderName || (message.sender === "booster" ? "Booster" : message.sender === "dev" ? "Dev" : "Customer")}
                  </span>
                  {getRoleBadge(message.senderRole || "") && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold text-white rounded ${getRoleGradient(message.senderRole || "")}`}>
                      {getRoleBadge(message.senderRole || "")}
                    </span>
                  )}
                  <span className="text-gray-500 text-[10px] ml-auto">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Simplified */}
      <div className="p-3 bg-[#111111] border-t border-[#222222]">
        <div className="bg-[#1a1a1a] rounded-lg flex items-center px-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white px-2 py-2 focus:outline-none text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
