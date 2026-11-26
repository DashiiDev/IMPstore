export const gamesData: Record<string, { name: string; ranks: Array<{ name: string; image: string }> }> = {
  "rocket-league": {
    name: "Rocket League",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rl/Bronze 1.png" },
      { name: "Bronze 2", image: "/imgs/ranks/rl/Bronze 2.png" },
      { name: "Bronze 3", image: "/imgs/ranks/rl/Bronze 3.png" },
      { name: "Silver 1", image: "/imgs/ranks/rl/Silver 1.png" },
      { name: "Silver 2", image: "/imgs/ranks/rl/Silver 2.png" },
      { name: "Silver 3", image: "/imgs/ranks/rl/Silver 3.png" },
      { name: "Gold 1", image: "/imgs/ranks/rl/Gold 1.png" },
      { name: "Gold 2", image: "/imgs/ranks/rl/Gold 2.png" },
      { name: "Gold 3", image: "/imgs/ranks/rl/Gold 3.png" },
      { name: "Platinum 1", image: "/imgs/ranks/rl/Platinum 1.png" },
      { name: "Platinum 2", image: "/imgs/ranks/rl/Platinum 2.png" },
      { name: "Platinum 3", image: "/imgs/ranks/rl/Platinum 3.png" },
      { name: "Diamond 1", image: "/imgs/ranks/rl/Diamond 1.png" },
      { name: "Diamond 2", image: "/imgs/ranks/rl/Diamond 2.png" },
      { name: "Diamond 3", image: "/imgs/ranks/rl/Diamond 3.png" },
      { name: "Champion 1", image: "/imgs/ranks/rl/Champion 1.png" },
      { name: "Champion 2", image: "/imgs/ranks/rl/Champion 2.png" },
      { name: "Champion 3", image: "/imgs/ranks/rl/Champion 3.png" },
      { name: "Grand Champion", image: "/imgs/ranks/rl/GC.png" },
    ]
  },
  "rocket-league-sideswipe": {
    name: "Rocket League Sideswipe",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rlss/Bronze 1.png" },
      { name: "Bronze 2", image: "/imgs/ranks/rlss/Bronze 2.png" },
      { name: "Bronze 3", image: "/imgs/ranks/rlss/Bronze 3.png" },
      { name: "Bronze 4", image: "/imgs/ranks/rlss/Bronze 4.png" },
      { name: "Bronze 5", image: "/imgs/ranks/rlss/Bronze 5.png" },
      { name: "Silver 1", image: "/imgs/ranks/rlss/Silver 1.png" },
      { name: "Silver 2", image: "/imgs/ranks/rlss/Silver 2.png" },
      { name: "Silver 3", image: "/imgs/ranks/rlss/Silver 3.png" },
      { name: "Silver 4", image: "/imgs/ranks/rlss/Silver 4.png" },
      { name: "Silver 5", image: "/imgs/ranks/rlss/Silver 5.png" },
      { name: "Gold 1", image: "/imgs/ranks/rlss/Gold 1.png" },
      { name: "Gold 2", image: "/imgs/ranks/rlss/Gold 2.png" },
      { name: "Gold 3", image: "/imgs/ranks/rlss/Gold 3.png" },
      { name: "Gold 4", image: "/imgs/ranks/rlss/Gold 4.png" },
      { name: "Gold 5", image: "/imgs/ranks/rlss/Gold 5.png" },
      { name: "Platinum 1", image: "/imgs/ranks/rlss/Platinum 1.png" },
      { name: "Platinum 2", image: "/imgs/ranks/rlss/Platinum 2.png" },
      { name: "Platinum 3", image: "/imgs/ranks/rlss/Platinum 3.png" },
      { name: "Platinum 4", image: "/imgs/ranks/rlss/Platinum 4.png" },
      { name: "Platinum 5", image: "/imgs/ranks/rlss/Platinum 5.png" },
      { name: "Diamond 1", image: "/imgs/ranks/rlss/Diamond 1.png" },
      { name: "Diamond 2", image: "/imgs/ranks/rlss/Diamond 2.png" },
      { name: "Diamond 3", image: "/imgs/ranks/rlss/Diamond 3.png" },
      { name: "Diamond 4", image: "/imgs/ranks/rlss/Diamond 4.png" },
      { name: "Diamond 5", image: "/imgs/ranks/rlss/Diamond 5.png" },
      { name: "Champion 1", image: "/imgs/ranks/rlss/Champion 1.png" },
      { name: "Champion 2", image: "/imgs/ranks/rlss/Champion 2.png" },
      { name: "Champion 3", image: "/imgs/ranks/rlss/Champion 3.png" },
      { name: "Champion 4", image: "/imgs/ranks/rlss/Champion 4.png" },
      { name: "Champion 5", image: "/imgs/ranks/rlss/Champion 5.png" },
      { name: "Grand Champion", image: "/imgs/ranks/rlss/GC.png" },
    ]
  }
}

// Rank order for progress calculation
export const rankOrder = [
  "Bronze 1", "Bronze 2", "Bronze 3", "Bronze 4", "Bronze 5",
  "Silver 1", "Silver 2", "Silver 3", "Silver 4", "Silver 5",
  "Gold 1", "Gold 2", "Gold 3", "Gold 4", "Gold 5",
  "Platinum 1", "Platinum 2", "Platinum 3", "Platinum 4", "Platinum 5",
  "Diamond 1", "Diamond 2", "Diamond 3", "Diamond 4", "Diamond 5",
  "Champion 1", "Champion 2", "Champion 3", "Champion 4", "Champion 5",
  "Grand Champion"
]

// Calculate progress percentage
export const calculateProgress = (initialRank: string, currentRank: string, desiredRank: string) => {
  const initialIndex = rankOrder.indexOf(initialRank)
  const currentIndex = rankOrder.indexOf(currentRank)
  const desiredIndex = rankOrder.indexOf(desiredRank)
  
  if (initialIndex === -1 || currentIndex === -1 || desiredIndex === -1) return 0
  if (desiredIndex <= initialIndex) return 0
  
  const totalSteps = desiredIndex - initialIndex
  const currentSteps = currentIndex - initialIndex
  
  if (currentSteps <= 0) return 0
  if (currentSteps >= totalSteps) return 100
  
  return Math.round((currentSteps / totalSteps) * 100)
}
