"use client"

import React from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"

const GAME_ID = "0c89181b9cfe4897afa41b0f94385da9"

const GamePlay: React.FC = () => {
  const { gamePath } = useParams()

  // Exact page URL required by GameDistribution
  const referrerUrl = encodeURIComponent(
    `${window.location.origin}/games/${gamePath}`
  )

  const iframeSrc = `https://html5.gamedistribution.com/${GAME_ID}/?gd_sdk_referrer_url=${referrerUrl}`

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Play Game</h1>

      {/* REQUIRED IFRAME */}
      <iframe
        src={iframeSrc}
        width="800"
        height="600"
        scrolling="none"
        frameBorder={0}
        allowFullScreen
        className="rounded-xl shadow-xl max-w-full"
      />

      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => window.history.back()}
      >
        Back to Games
      </Button>
    </div>
  )
}

export default GamePlay
