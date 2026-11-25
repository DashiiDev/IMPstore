"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [sessionId, setSessionId] = useState("")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id")
    const gameParam = searchParams.get("game") || "rocket-league"
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      setStatus("success")
      
      // Generate a unique order ID and save to localStorage
      const orderId = `order-${sessionIdParam}`
      localStorage.setItem("lastOrderId", orderId)
      localStorage.setItem("lastOrderGame", gameParam)
      
      setTimeout(() => {
        router.push(`/boosting-status/${orderId}?game=${gameParam}`)
      }, 2000)
    } else {
      setStatus("error")
    }
  }, [searchParams, router])

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

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Failed</h1>
          <p className="text-white mb-6">Could not verify your payment</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
          >
            Return to Home
          </button>
        </div>
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-12 max-w-lg w-full border border-green-500/30 shadow-2xl shadow-green-500/20 text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-300 mb-8">
            Thank you for your purchase. Redirecting to chat with your booster...
          </p>
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm">Session ID</p>
            <p className="text-white font-mono text-xs">{sessionId}</p>
          </div>
          <div className="animate-pulse">
            <p className="text-purple-400">Opening chat...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 text-white text-2xl font-semibold">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
