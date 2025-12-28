import React from 'react';
import { ExternalLink, Star, Shield, Zap, Megaphone, Gift, Sparkles } from 'lucide-react';

const sponsors = [
  {
    name: 'CryptoVault',
    description: 'Secure your crypto assets',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'TradeFast',
    description: 'Lightning-fast trading',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'BlockPro',
    description: 'Professional blockchain tools',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
  },
];

const SponsorsPanel: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Ad Banner - Main */}
      <div className="glass-card p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Megaphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold">Featured Ads</h3>
            <p className="text-xs text-muted-foreground">Sponsored content</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {sponsors.map((sponsor, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 cursor-pointer hover:bg-background/80 transition-all group"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${sponsor.color}`}>
                <sponsor.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {sponsor.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{sponsor.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Premium Ad */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Premium</p>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
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

      {/* Partner Logos */}
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wider">Trusted Partners</p>
        <div className="grid grid-cols-3 gap-2">
          {['ETH', 'BTC', 'SOL'].map((coin) => (
            <div
              key={coin}
              className="aspect-square rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <span className="font-display text-sm font-bold text-muted-foreground">{coin}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsPanel;
