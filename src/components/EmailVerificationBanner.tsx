"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Mail, X } from "lucide-react"
import { useState } from "react"

export const EmailVerificationBanner = () => {
  const { user, firebaseUser, resendVerificationEmail } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!user || !firebaseUser || user.emailVerified || dismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Mail className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Email not verified</p>
              <p className="text-xs text-muted-foreground">
                Check your inbox for the verification link to unlock all features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resendVerificationEmail} className="text-xs bg-transparent">
              Resend Email
            </Button>
            <button onClick={() => setDismissed(true)} className="p-1 hover:bg-background/50 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
