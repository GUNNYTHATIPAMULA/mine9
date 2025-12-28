import React from 'react';
import TopHeader from '@/components/TopHeader';
import BottomNav from '@/components/BottomNav';
import ReferralPanel from '@/components/ReferralPanel';
import ReferralTeam from '@/components/ReferralTeam';
import { Gift, Zap, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Referrals: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate referral boost (5% per referral, max 50%)
  const referralBoost = Math.min(50, (user?.referralsCount || 0) * 5);

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 mb-3">
            <Gift className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-1">
            <span className="gradient-text">Referral Program</span>
          </h1>
          <p className="text-muted-foreground text-sm">Invite friends and boost your mining rate!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-3 text-center">
            <Users className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="font-display text-xl font-bold">{user?.referralsCount || 0}</p>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Gift className="w-5 h-5 mx-auto text-accent mb-1" />
            <p className="font-display text-xl font-bold gradient-gold-text">{user?.referralEarnings || 0}</p>
            <p className="text-xs text-muted-foreground">MNX Earned</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Zap className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
            <p className="font-display text-xl font-bold text-yellow-500">+{referralBoost}%</p>
            <p className="text-xs text-muted-foreground">Mining Boost</p>
          </div>
          <div className="glass-card p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="font-display text-xl font-bold text-green-500">5%</p>
            <p className="text-xs text-muted-foreground">Per Referral</p>
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-display text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            How It Works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-primary text-sm">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Share Your Code</p>
                <p className="text-xs text-muted-foreground">Share your unique referral code with friends</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-accent text-sm">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">They Join & Mine</p>
                <p className="text-xs text-muted-foreground">Friends sign up using your code</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-green-500 text-sm">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">You Earn +5% Boost</p>
                <p className="text-xs text-muted-foreground">Get +5% mining rate boost per referral (max 50%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <ReferralPanel />
        </div>

        {/* Team */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <ReferralTeam />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Referrals;