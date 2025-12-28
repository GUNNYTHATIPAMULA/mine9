"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import TopHeader from "@/components/TopHeader"
import BottomNav from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Gamepad2, Zap, Trophy } from "lucide-react"
import { toast } from "sonner"

interface Game {
  id: string
  name: string
}

/* ✅ Simple monetized games list */
const games: Game[] = [
  {
    id: "knife-smash",
    name: "Knife Smash",
  },
]

const Games: React.FC = () => {
  const navigate = useNavigate()

  const [gameData, setGameData] = useState<Record<string, { lastPlayed: number; boost: number }>>({})
  const [totalBoost, setTotalBoost] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("minex_game_boosts")
    if (saved) {
      const parsed = JSON.parse(saved)
      setGameData(parsed)

      let boost = 0
      Object.values(parsed).forEach((data: any) => {
        boost += data.boost || 0
      })

      setTotalBoost(boost)
      localStorage.setItem("minex_mining_boost", JSON.stringify(boost))
    }
  }, [])

  const playGame = (game: Game) => {
    toast.success(`Opening ${game.name}`)
    navigate(`/games/${game.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-1">
            <span className="gradient-text">Game Zone</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Play games to boost mining rate!
          </p>
        </div>

        {/* Total Boost */}
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-primary">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Mining Boost</p>
                <p className="font-display text-2xl font-bold gradient-gold-text">
                  +{totalBoost}%
                </p>
              </div>
            </div>
            <Trophy className="w-8 h-8 text-accent/50" />
          </div>
        </div>

        {/* ✅ Games List (ADDED CLEANLY – UI SAME) */}
        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="glass-card p-4 flex justify-between items-center"
            >
              <span className="font-medium">{game.name}</span>
              <Button onClick={() => playGame(game)}>
                Play
              </Button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Games
