import { Suspense } from "react"
import BoostingClient from "./BoostingClient"

export default async function BoostingPage({ params }: { params: Promise<{ gameId: string }> }) {
  const resolvedParams = await params
  const gameId = resolvedParams.gameId

  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center text-white">Loading...</div>}>
      <BoostingClient gameId={gameId} />
    </Suspense>
  )
}
