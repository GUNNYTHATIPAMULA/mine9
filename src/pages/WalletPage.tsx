import React from 'react';
import { Link } from 'react-router-dom';
import TopHeader from '@/components/TopHeader';
import BottomNav from '@/components/BottomNav';
import SponsorsPanel from '@/components/SponsorsPanel';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, Pickaxe, Zap, TrendingUp, Gift, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const WalletPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Wallet Balance Card */}
        <div className="glass-card p-5 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <WalletIcon className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
              <h1 className="font-display text-4xl font-bold gradient-gold-text mb-1">
                {user?.balance.toLocaleString() || 0}
              </h1>
              <p className="text-base text-muted-foreground font-display">MNX Coins</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <button className="glass-card p-4 text-center hover:border-primary/50 transition-all">
            <div className="p-2.5 rounded-xl bg-green-500/20 w-fit mx-auto mb-2">
              <ArrowDownLeft className="w-5 h-5 text-green-500" />
            </div>
            <p className="font-display font-bold text-sm">Receive</p>
            <p className="text-xs text-muted-foreground">Deposit MNX</p>
          </button>
          <button className="glass-card p-4 text-center hover:border-primary/50 transition-all">
            <div className="p-2.5 rounded-xl bg-blue-500/20 w-fit mx-auto mb-2">
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
            <p className="font-display font-bold text-sm">Send</p>
            <p className="text-xs text-muted-foreground">Withdraw MNX</p>
          </button>
        </div>

        {/* Stats */}
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <h3 className="font-display text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Wallet Stats
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-lg">{user?.totalMined || 0}</p>
              <p className="text-xs text-muted-foreground">Total Mined</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Gift className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-accent">{user?.referralEarnings || 0}</p>
              <p className="text-xs text-muted-foreground">Referral Bonus</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Pickaxe className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-lg">{Math.floor((user?.totalMined || 0) / 20)}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SponsorsPanel />
        </div>

        {/* Start Mining Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <Link to="/mining">
            <Button variant="mining" size="xl" className="w-full glow-button">
              <Zap className="w-5 h-5" />
              Start Mining
              <Pickaxe className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WalletPage;