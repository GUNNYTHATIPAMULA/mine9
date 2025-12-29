import React from "react"
import { Wallet as WalletIcon, TrendingUp, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const Wallet: React.FC = () => {
  const { user } = useAuth()
  const [copied, setCopied] = React.useState(false)

  if (!user) return null

  const walletAddress = `0x${user.id.replace(/-/g, "").slice(0, 32)}`

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    toast.success("Wallet copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <WalletIcon className="w-6 h-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="font-display text-3xl font-bold gradient-gold-text">
              {user.balance} MNX
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-lg">
          <code className="text-xs truncate flex-1">{walletAddress}</code>
          <Button size="sm" variant="ghost" onClick={copyAddress}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Total Mined</span>
        </div>
        <p className="font-display text-2xl font-bold">
          {user.totalMined} MNX
        </p>
      </div>
    </div>
  )
}

export default Wallet
