"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Pickaxe, Zap, Clock, Bell, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/hooks/useNotifications"
import { toast } from "sonner"

const MINING_DURATION = 2 * 60 * 60 // 2 hours (seconds)

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

  const referralBoost = Math.min(50, (user?.referralsCount || 0) * 5)
  const gameBoost = safeGetNumber("minex_mining_boost", 0)
  const totalBoost = referralBoost + gameBoost

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
        setTimeRemaining(remaining)
        setMiningReward(parsed.reward)
        setIsMining(true)
      } else {
        updateBalance(parsed.reward)
        onMiningComplete?.(parsed.reward)
        localStorage.removeItem("minex_mining_state")
      }
    } catch {
      localStorage.removeItem("minex_mining_state")
    }
  }, [updateBalance, onMiningComplete])

  /* ---------- TIMER (MOBILE SAFE) ---------- */
  useEffect(() => {
    if (!isMining || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsMining(false)
          updateBalance(miningReward)
          onMiningComplete?.(miningReward)

          if (permission === "granted") {
            sendNotification("Mining Complete 🎉", {
              body: `You earned ${miningReward} MNX`,
            })
          }

          localStorage.removeItem("minex_mining_state")
          return 0
        }
        return prev - 1
      })
    }, 3000) // 🔥 MOBILE SAFE (NOT 1000ms)

    return () => clearInterval(interval)
  }, [
    isMining,
    timeRemaining,
    miningReward,
    updateBalance,
    onMiningComplete,
    permission,
    sendNotification,
  ])

  /* ---------- START MINING ---------- */
  const startMining = useCallback(async () => {
    if (!user) return

    if (permission !== "granted") {
      await requestPermission()
    }

    const baseReward = 20
    const reward = Math.floor(
      baseReward * (1 + totalBoost / 100)
    )

    const endTime = Date.now() + MINING_DURATION * 1000

    localStorage.setItem(
      "minex_mining_state",
      JSON.stringify({ endTime, reward })
    )

    setMiningReward(reward)
    setTimeRemaining(MINING_DURATION)
    setIsMining(true)

    // ✅ AD ONLY ON USER ACTION
    window.open("https://otieu.com/4/10385074", "_blank")

    toast.info("Mining started!")
  }, [permission, requestPermission, totalBoost, user])

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="glass-card p-4 text-center">
      {isMining ? (
        <>
          <Pickaxe className="w-10 h-10 mx-auto text-primary mb-3 animate-bounce" />
          <p className="font-display text-2xl font-bold">
            {formatTime(timeRemaining)}
          </p>

          <div className="text-accent mt-2 flex justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{miningReward} MNX</span>
          </div>

          {totalBoost > 0 && (
            <div className="text-green-500 text-xs mt-1 flex justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{totalBoost}% boost
            </div>
          )}

          {permission === "granted" && (
            <div className="text-xs text-muted-foreground mt-2 flex justify-center gap-1">
              <Bell className="w-3 h-3" />
              Notifications enabled
            </div>
          )}
        </>
      ) : (
        <Button
          variant="mining"
          size="xl"
          className="w-full glow-button"
          onClick={startMining}
        >
          <Pickaxe className="w-5 h-5" />
          Start Mining
        </Button>
      )}
    </div>
  )
}

export default MiningTimer
