"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Copy, Check, Users, Gift, Share2 } from "lucide-react"
import { toast } from "sonner"

const ReferralPanel: React.FC = () => {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralCode = user?.referralCode || ""
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast.success("Referral code copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied!")
  }

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join MINEX Mining",
          text: `Use my referral code ${referralCode} to get 10 bonus MNX coins!`,
          url: referralLink,
        })
        window.location.href = "https://otieu.com/4/10386652"
      } catch (err) {
        copyLink()
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="glass-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-accent to-primary">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold">Invite Friends</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Get 15 MNX, they get 10 MNX</p>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 mx-auto text-primary mb-1" />
          <p className="font-display text-xl sm:text-2xl font-bold">{user?.referralsCount || 0}</p>
          <p className="text-xs text-muted-foreground">Referrals</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Gift className="w-5 h-5 mx-auto text-accent mb-1" />
          <p className="font-display text-xl sm:text-2xl font-bold gradient-gold-text">{user?.referralEarnings || 0}</p>
          <p className="text-xs text-muted-foreground">MNX Earned</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-secondary/30 rounded-lg p-3">
        <p className="text-xs text-muted-foreground mb-2">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-display text-lg sm:text-xl font-bold text-primary tracking-wider">
            {referralCode}
          </code>
          <Button variant="ghost" size="sm" onClick={copyCode}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Share Button */}
      <Button variant="mining" className="w-full" onClick={shareReferral}>
        <Share2 className="w-4 h-4" />
        Share Referral Link
      </Button>

      {/* How it works */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">How it works:</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Share your code with friends
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            They get 10 MNX bonus when they sign up
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            You get 15 MNX bonus per referral
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Plus 10% of their mining rewards
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ReferralPanel
