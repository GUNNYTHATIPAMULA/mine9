import React, { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Zap, User } from "lucide-react"

interface TeamMember {
  id: string
  username: string
  totalMined: number
  joinedAt: number
}

const ReferralTeam: React.FC = () => {
  const { user } = useAuth()
  const [team, setTeam] = useState<TeamMember[]>([])
  const adRef = useRef<HTMLDivElement | null>(null)

  /* ---------- LOAD SINGLE RESPONSIVE AD ---------- */
  useEffect(() => {
    if (!adRef.current) return

    adRef.current.innerHTML = ""

    ;(window as any).atOptions = {
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

  /* ---------- LOAD TEAM ---------- */
  useEffect(() => {
    const savedUsers = JSON.parse(
      localStorage.getItem("minex_users") || "[]"
    )

    const referrals = savedUsers
      .filter((u: any) => u.referredBy === user?.id)
      .map((u: any) => ({
        id: u.id,
        username: u.username,
        totalMined: u.totalMined || 0,
        joinedAt: u.joinedAt || Date.now(),
      }))

    setTeam(referrals)
  }, [user?.id])

  return (
    <div className="glass-card p-4 sm:p-6">
      {/* ✅ RESPONSIVE AD */}
      <div className="mb-4 flex justify-center">
        <div
          ref={adRef}
          className="max-w-full overflow-hidden scale-[0.9] sm:scale-100"
        />
      </div>

      {/* Bonus */}
      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">
              Your Mining Bonus from Team
            </p>
            <p className="font-display text-xl font-bold gradient-text">
              +{Math.min(50, team.length * 5)}%
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Each referral gives +5% (max 50%)
        </p>
      </div>

      {/* Team Members */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Team Members</p>

        {team.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No team members yet. Share your referral code!
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {team.map(member => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"
              >
                <div className="p-1.5 rounded-full bg-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {member.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-sm text-accent">
                    {member.totalMined} MNX
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralTeam
