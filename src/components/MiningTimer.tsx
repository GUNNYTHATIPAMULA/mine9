"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Pickaxe, Zap, Clock, Bell, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/hooks/useNotifications"
import { toast } from "sonner"

/* ✅ 1 HOUR (FIXED) */
// const MINING_DURATION = 1 * 60 * 60 // 1 hour in seconds
const MINING_DURATION = 1 * 60 * 60 // 5 minutes in seconds

/* ---------- SAFE STORAGE ---------- */
const safeGetNumber = (key: string, fallback = 0) => {
  try {
    const v = localStorage.getItem(key)
    if (!v) return fallback
    const n = Number(v)
    return isNaN(n) ? fallback : n
  } catch {
    return fallback
  }
}

interface MiningTimerProps {
  onMiningComplete?: (reward: number) => void
}

const MiningTimer: React.FC<MiningTimerProps> = ({ onMiningComplete }) => {
  const { user, updateBalance } = useAuth()
  const { permission, requestPermission, sendNotification } =
    useNotifications()

  const [isMining, setIsMining] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [miningReward, setMiningReward] = useState(0)

  /* 🔐 PREVENT DOUBLE CREDIT */
  const completedRef = useRef(false)

  /* ---------- BOOST ---------- */
  const referralBoost = Math.min(50, (user?.referralsCount || 0) * 5)
  const gameBoost = safeGetNumber("minex_mining_boost", 0)
  const totalBoost = referralBoost + gameBoost

  /* ---------- COMPLETE MINING (SINGLE SOURCE OF TRUTH) ---------- */
  const completeMining = useCallback(
    async (reward: number) => {
      if (completedRef.current) return
      completedRef.current = true

      await updateBalance(reward)
      onMiningComplete?.(reward)

      if (permission === "granted") {
        sendNotification("Mining Complete 🎉", {
          body: `You earned ${reward} MNX`,
        })
      }

      localStorage.removeItem("minex_mining_state")
      setIsMining(false)
      setTimeRemaining(0)
    },
    [updateBalance, onMiningComplete, permission, sendNotification]
  )

  /* ---------- RESTORE STATE ---------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("minex_mining_state")
      if (!saved) return

      const parsed = JSON.parse(saved)
      if (!parsed?.endTime || !parsed?.reward) return

      const remaining = Math.floor(
        (parsed.endTime - Date.now()) / 1000
      )

      if (remaining > 0) {
        setMiningReward(parsed.reward)
        setTimeRemaining(remaining)
        setIsMining(true)
      } else {
        completeMining(parsed.reward)
      }
    } catch {
      localStorage.removeItem("minex_mining_state")
    }
  }, [completeMining])

  /* ---------- TIMER (MOBILE SAFE) ---------- */
  useEffect(() => {
    if (!isMining || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          completeMining(miningReward)
          return 0
        }
        return prev - 1
      })
    }, 1000) // ⏱️ accurate & stable

    return () => clearInterval(interval)
  }, [isMining, timeRemaining, miningReward, completeMining])

  /* ---------- START ---------- */
  const startMining = useCallback(async () => {
    if (!user) return

    completedRef.current = false

    if (permission !== "granted") {
      await requestPermission()
    }

    const baseReward = 20
    const boostedReward = Math.floor(
      baseReward * (1 + totalBoost / 100)
    )

    const endTime = Date.now() + MINING_DURATION * 1000

    localStorage.setItem(
      "minex_mining_state",
      JSON.stringify({ endTime, reward: boostedReward })
    )

    setMiningReward(boostedReward)
    setTimeRemaining(MINING_DURATION)
    setIsMining(true)

    // ✅ AD ON CLICK ONLY
    window.open("https://otieu.com/4/10385074", "_blank")

    toast.info(
      `Mining started! ${
        totalBoost > 0 ? `+${totalBoost}% boost active` : ""
      }`
    )
  }, [user, permission, requestPermission, totalBoost])

  /* ---------- FORMAT ---------- */
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const progress =
    ((MINING_DURATION - timeRemaining) / MINING_DURATION) * 100

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="glass-card p-4 sm:p-6 md:p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold gradient-text mb-1 sm:mb-2">
            Mining Station
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Start mining to earn MNX coins
          </p>
        </div>

        <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8">
          {isMining && (
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          )}

          <svg
            className="w-full h-full transform -rotate-90 relative z-10"
            viewBox="0 0 192 192"
          >
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
              fill="none"
            />

            {isMining && (
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={
                  2 * Math.PI * 88 * (1 - progress / 100)
                }
                className="transition-all duration-1000"
              />
            )}

            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            {isMining ? (
              <>
                <Pickaxe className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2 animate-bounce" />
                <span className="font-display text-xl sm:text-2xl font-bold">
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Mining...
                </span>
              </>
            ) : (
              <>
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-accent mb-2" />
                <span className="font-display text-base sm:text-lg font-bold">
                  Ready
                </span>
              </>
            )}
          </div>
        </div>

        {isMining ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">
                Expected: {miningReward} MNX
              </span>
            </div>

            {totalBoost > 0 && (
              <div className="flex items-center justify-center gap-1 text-xs text-green-500">
                <TrendingUp className="w-3 h-3" />
                <span>+{totalBoost}% boost active</span>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="mining"
            size="xl"
            onClick={startMining}
            className="w-full max-w-xs glow-button"
          >
            <Pickaxe className="w-5 h-5" />
            Start Mining
          </Button>
        )}
      </div>
    </div>
  )
}

export default MiningTimer
