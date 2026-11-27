export interface RankData {
  name: string
  image: string
  value: number
}

export const gamesData: Record<string, { name: string; ranks: RankData[] }> = {
  "rocket-league": {
    name: "Rocket League",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rl/Bronze 1.png", value: 1 },
      { name: "Bronze 2", image: "/imgs/ranks/rl/Bronze 2.png", value: 2 },
      { name: "Bronze 3", image: "/imgs/ranks/rl/Bronze 3.png", value: 3 },
      { name: "Silver 1", image: "/imgs/ranks/rl/Silver 1.png", value: 4 },
      { name: "Silver 2", image: "/imgs/ranks/rl/Silver 2.png", value: 5 },
      { name: "Silver 3", image: "/imgs/ranks/rl/Silver 3.png", value: 6 },
      { name: "Gold 1", image: "/imgs/ranks/rl/Gold 1.png", value: 7 },
      { name: "Gold 2", image: "/imgs/ranks/rl/Gold 2.png", value: 8 },
      { name: "Gold 3", image: "/imgs/ranks/rl/Gold 3.png", value: 9 },
      { name: "Platinum 1", image: "/imgs/ranks/rl/Platinum 1.png", value: 10 },
      { name: "Platinum 2", image: "/imgs/ranks/rl/Platinum 2.png", value: 11 },
      { name: "Platinum 3", image: "/imgs/ranks/rl/Platinum 3.png", value: 12 },
      { name: "Diamond 1", image: "/imgs/ranks/rl/Diamond 1.png", value: 13 },
      { name: "Diamond 2", image: "/imgs/ranks/rl/Diamond 2.png", value: 14 },
      { name: "Diamond 3", image: "/imgs/ranks/rl/Diamond 3.png", value: 15 },
      { name: "Champion 1", image: "/imgs/ranks/rl/Champion 1.png", value: 16 },
      { name: "Champion 2", image: "/imgs/ranks/rl/Champion 2.png", value: 17 },
      { name: "Champion 3", image: "/imgs/ranks/rl/Champion 3.png", value: 18 },
      { name: "Grand Champion", image: "/imgs/ranks/rl/GC.png", value: 19 },
    ]
  },
  "rocket-league-sideswipe": {
    name: "Rocket League Sideswipe",
    ranks: [
      { name: "Bronze 1", image: "/imgs/ranks/rlss/Bronze 1.png", value: 1 },
      { name: "Bronze 2", image: "/imgs/ranks/rlss/Bronze 2.png", value: 2 },
      { name: "Bronze 3", image: "/imgs/ranks/rlss/Bronze 3.png", value: 3 },
      { name: "Bronze 4", image: "/imgs/ranks/rlss/Bronze 4.png", value: 4 },
      { name: "Bronze 5", image: "/imgs/ranks/rlss/Bronze 5.png", value: 5 },
      { name: "Silver 1", image: "/imgs/ranks/rlss/Silver 1.png", value: 6 },
      { name: "Silver 2", image: "/imgs/ranks/rlss/Silver 2.png", value: 7 },
      { name: "Silver 3", image: "/imgs/ranks/rlss/Silver 3.png", value: 8 },
      { name: "Silver 4", image: "/imgs/ranks/rlss/Silver 4.png", value: 9 },
      { name: "Silver 5", image: "/imgs/ranks/rlss/Silver 5.png", value: 10 },
      { name: "Gold 1", image: "/imgs/ranks/rlss/Gold 1.png", value: 11 },
      { name: "Gold 2", image: "/imgs/ranks/rlss/Gold 2.png", value: 12 },
      { name: "Gold 3", image: "/imgs/ranks/rlss/Gold 3.png", value: 13 },
      { name: "Gold 4", image: "/imgs/ranks/rlss/Gold 4.png", value: 14 },
      { name: "Gold 5", image: "/imgs/ranks/rlss/Gold 5.png", value: 15 },
      { name: "Platinum 1", image: "/imgs/ranks/rlss/Platinum 1.png", value: 16 },
      { name: "Platinum 2", image: "/imgs/ranks/rlss/Platinum 2.png", value: 17 },
      { name: "Platinum 3", image: "/imgs/ranks/rlss/Platinum 3.png", value: 18 },
      { name: "Platinum 4", image: "/imgs/ranks/rlss/Platinum 4.png", value: 19 },
      { name: "Platinum 5", image: "/imgs/ranks/rlss/Platinum 5.png", value: 20 },
      { name: "Diamond 1", image: "/imgs/ranks/rlss/Diamond 1.png", value: 21 },
      { name: "Diamond 2", image: "/imgs/ranks/rlss/Diamond 2.png", value: 22 },
      { name: "Diamond 3", image: "/imgs/ranks/rlss/Diamond 3.png", value: 23 },
      { name: "Diamond 4", image: "/imgs/ranks/rlss/Diamond 4.png", value: 24 },
      { name: "Diamond 5", image: "/imgs/ranks/rlss/Diamond 5.png", value: 25 },
      { name: "Champion 1", image: "/imgs/ranks/rlss/Champion 1.png", value: 26 },
      { name: "Champion 2", image: "/imgs/ranks/rlss/Champion 2.png", value: 27 },
      { name: "Champion 3", image: "/imgs/ranks/rlss/Champion 3.png", value: 28 },
      { name: "Champion 4", image: "/imgs/ranks/rlss/Champion 4.png", value: 29 },
      { name: "Champion 5", image: "/imgs/ranks/rlss/Champion 5.png", value: 30 },
      { name: "Grand Champion", image: "/imgs/ranks/rlss/GC.png", value: 31 },
    ]
  }
}

// Rank order for progress calculation (RLSS)
export const rankOrder = [
  "Bronze 1", "Bronze 2", "Bronze 3", "Bronze 4", "Bronze 5",
  "Silver 1", "Silver 2", "Silver 3", "Silver 4", "Silver 5",
  "Gold 1", "Gold 2", "Gold 3", "Gold 4", "Gold 5",
  "Platinum 1", "Platinum 2", "Platinum 3", "Platinum 4", "Platinum 5",
  "Diamond 1", "Diamond 2", "Diamond 3", "Diamond 4", "Diamond 5",
  "Champion 1", "Champion 2", "Champion 3", "Champion 4", "Champion 5",
  "Grand Champion"
]

// Calculate progress percentage considering rank + division
export const calculateProgress = (initialRank: string, currentRank: string, desiredRank: string, currentDivision: number = 1) => {
  const currentIndex = rankOrder.indexOf(currentRank)
  const desiredIndex = rankOrder.indexOf(desiredRank)
  
  console.log('Progress calculation:', { initialRank, currentRank, desiredRank, currentDivision, currentIndex, desiredIndex })
  
  if (currentIndex === -1 || desiredIndex === -1) {
    console.log('Invalid rank index')
    return 0
  }
  if (desiredIndex <= currentIndex) return 100 // Already at or past desired rank
  
  // Calculate with division
  const currentTotalValue = currentIndex * 5 + currentDivision
  const desiredTotalValue = desiredIndex * 5 + 5 // Assume division 5 for desired
  const initialTotalValue = rankOrder.indexOf(initialRank) * 5 + 1
  
  const totalSteps = desiredTotalValue - initialTotalValue
  const currentSteps = currentTotalValue - initialTotalValue
  
  console.log('Progress values:', { currentTotalValue, desiredTotalValue, initialTotalValue, totalSteps, currentSteps })
  
  if (currentSteps <= 0) return 0
  if (currentSteps >= totalSteps) return 100
  
  const percentage = Math.round((currentSteps / totalSteps) * 100)
  console.log('Calculated percentage:', percentage)
  return percentage
}

// Get rank image by name and game
export const getRankImage = (rankName: string, game: string): string => {
  const gameData = gamesData[game]
  if (!gameData) {
    console.log('Game not found:', game)
    return ""
  }
  const rank = gameData.ranks.find(r => r.name === rankName)
  if (!rank) {
    console.log('Rank not found:', rankName, 'in game:', game)
    return ""
  }
  console.log('Found rank image:', rank.image)
  return rank.image
}
