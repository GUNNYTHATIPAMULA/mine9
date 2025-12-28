"use client"

import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import TopHeader from "@/components/TopHeader"
import BottomNav from "@/components/BottomNav"
import SponsorsPanel from "@/components/SponsorsPanel"
import { Button } from "@/components/ui/button"
import {
  Wallet as WalletIcon,
  Pickaxe,
  Zap,
  TrendingUp,
  Gift,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

declare global {
  interface Window {
    atOptions?: any
  }
}

const WalletPage: React.FC = () => {
  const { user } = useAuth()
  const adRef = useRef<HTMLDivElement | null>(null)

  /* ======================
      Adsterra Banner
  ====================== */
  useEffect(() => {
    if (!adRef.current) return

    adRef.current.innerHTML = ""

    window.atOptions = {
      key: "96ec45ebdbbf9b2d00b73538121eeca4",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    }

    const script = document.createElement("script")
    script.src =
      "https://www.highperformanceformat.com/96ec45ebdbbf9b2d00b73538121eeca4/invoke.js"
    script.async = true

    adRef.current.appendChild(script)

    return () => {
      if (adRef.current) adRef.current.innerHTML = ""
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Wallet Balance */}
        <div className="glass-card p-5 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <WalletIcon className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              Your Balance
            </p>
            <h1 className="font-display text-4xl font-bold gradient-gold-text mb-1">
              {user?.balance?.toLocaleString() || 0}
            </h1>
            <p className="text-base text-muted-foreground font-display">
              MNX Coins
            </p>
          </div>
        </div>

        {/* 🔹 Ad Banner */}
        <div
          className="glass-card p-3 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div
            ref={adRef}
            className="flex justify-center items-center min-h-[90px]"
          />
        </div>

        {/* Stats */}
        <div
          className="glass-card p-4 animate-fade-in"
          style={{ animationDelay: "0.15s" }}
        >
          <h3 className="font-display text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Wallet Stats
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-lg">
                {user?.totalMined || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Total Mined
              </p>
            </div>

            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Gift className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-accent">
                {user?.referralEarnings || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Referral Bonus
              </p>
            </div>

            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Pickaxe className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-lg">
                {Math.floor((user?.totalMined || 0) / 20)}
              </p>
              <p className="text-xs text-muted-foreground">
                Sessions
              </p>
            </div>
          </div>
        </div>

        {/* Sponsors */}
        <SponsorsPanel />

        {/* Start Mining */}
        <Link to="/mining">
          <Button
            variant="mining"
            size="xl"
            className="w-full glow-button"
          >
            <Zap className="w-5 h-5" />
            Start Mining
            <Pickaxe className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}

export default WalletPage
