"use client"

import React, { useEffect, useRef } from "react"
import {
  Megaphone,
  Gift,
  Sparkles,
} from "lucide-react"

const SponsorsPanel: React.FC = () => {
  const adRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!adRef.current) return

    // Clear any existing ad
    adRef.current.innerHTML = ""

    // Inject global ad options
    ;(window as any).atOptions = {
      key: "4909affa0e2b4574e0e1da721ff95fd9",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    }

    // Inject ad script
    const script = document.createElement("script")
    script.src =
      "https://www.highperformanceformat.com/4909affa0e2b4574e0e1da721ff95fd9/invoke.js"
    script.async = true

    adRef.current.appendChild(script)

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = ""
      }
    }
  }, [])

  return (
    <div className="space-y-3">
      {/* Featured Ads */}
      <div className="glass-card p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Megaphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold">
              Featured Ads
            </h3>
            <p className="text-xs text-muted-foreground">
              Sponsored content
            </p>
          </div>
        </div>

        {/* ✅ Ad Container */}
        <div
          ref={adRef}
          className="flex justify-center items-center min-h-[50px]"
        />
      </div>

      {/* Premium Banner */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
        <div className="relative text-center">
          <div id="container-9c351997fbecf2477790d9bdb0ba5c84"></div>

          <p className="font-display text-lg font-bold gradient-text mb-1">
            Boost Your Mining Power
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Upgrade to Premium for 2x rewards
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium">
            <Gift className="w-4 h-4" />
            Get Premium
          </div>
        </div>
      </div>

      {/* Trusted Partners */}
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wider">
          Trusted Partners
        </p>

        <div className="grid grid-cols-3 gap-2">
          {["ETH", "BTC", "SOL"].map((coin) => (
            <div
              key={coin}
              className="aspect-square rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <span className="font-display text-sm font-bold text-muted-foreground">
                {coin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SponsorsPanel
