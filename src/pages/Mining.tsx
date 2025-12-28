"use client"

import React, { useEffect, useState } from "react"
import TopHeader from "@/components/TopHeader"
import BottomNav from "@/components/BottomNav"
import MiningTimer from "@/components/MiningTimer"
import SponsorsPanel from "@/components/SponsorsPanel"
import { Cpu, Zap, Shield, Award } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

/* ---------- SAFE STORAGE HELPERS ---------- */
const safeGetNumber = (key: string, fallback = 0) => {
  try {
    const value = localStorage.getItem(key)
    if (!value) return fallback
    const num = Number(value)
    return isNaN(num) ? fallback : num
  } catch {
    return fallback
  }
}

const features = [
  { icon: Cpu, title: "Cloud Mining", description: "No hardware required" },
  { icon: Zap, title: "Instant Rewards", description: "20 MNX per session" },
  { icon: Shield, title: "Secure", description: "Protected earnings" },
  { icon: Award, title: "Referral Bonus", description: "+5% per invite" },
]

const miningTiers = [
  { level: "Bronze", range: "0-100", bonus: "1x", active: true },
  { level: "Silver", range: "100-500", bonus: "1.5x", active: false },
  { level: "Gold", range: "500-2000", bonus: "2x", active: false },
  { level: "Platinum", range: "2000+", bonus: "3x", active: false },
]

const Mining: React.FC = () => {
  const { user, loading } = useAuth()
  const [gameBoost, setGameBoost] = useState(0)

  /* ---------- SAFE EFFECT ---------- */
  useEffect(() => {
    const boost = safeGetNumber("minex_mining_boost", 0)
    setGameBoost(boost)
  }, [])

  /* ---------- LOADING GUARD (CRITICAL) ---------- */
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading mining station...</p>
      </div>
    )
  }

  const referralBoost = Math.min(50, user.referralsCount * 5)
  const totalBoost = referralBoost + gameBoost

  const handleMiningComplete = (reward: number) => {
    toast.success(`Mining complete! +${reward} MNX added to your wallet!`)
  }

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-2xl font-bold gradient-text mb-1">
            Mining Station
          </h1>
          <p className="text-sm text-muted-foreground">
            Earn 20 MNX per session{" "}
            {totalBoost > 0 && (
              <span className="text-green-500">
                (+{totalBoost}% boost)
              </span>
            )}
          </p>
        </div>

        {/* Mining Timer */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <MiningTimer onMiningComplete={handleMiningComplete} />
        </div>

        {/* Features */}
        <div
          className="grid grid-cols-2 gap-3 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card p-3 text-center">
              <div className="p-2 rounded-xl bg-primary/20 w-fit mx-auto mb-2">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold mb-0.5">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Levels */}
        <div
          className="glass-card p-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="font-display text-lg font-bold mb-3">
            Mining Levels
          </h3>
          <div className="space-y-2">
            {miningTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  tier.active
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      tier.active
                        ? "bg-primary animate-pulse"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                  <div>
                    <p className="font-display text-sm font-bold">
                      {tier.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.range} MNX
                    </p>
                  </div>
                </div>
                <span className="font-display text-sm font-bold gradient-gold-text">
                  {tier.bonus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsors */}
        <SponsorsPanel />
      </div>

      <BottomNav />
    </div>
  )
}

export default Mining
