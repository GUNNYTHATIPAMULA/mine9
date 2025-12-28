import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TopHeader from '@/components/TopHeader';
import BottomNav from '@/components/BottomNav';
import SponsorsPanel from '@/components/SponsorsPanel';
import { TrendingUp, Users, Coins, Activity, Wallet, Pickaxe, Zap, Shield, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Users', value: '12.5K', icon: Users, change: '+12%' },
  { label: 'Coins Today', value: '245K', icon: Coins, change: '+8%' },
  { label: 'Hashrate', value: '1.2 TH/s', icon: Activity, change: '+5%' },
  { label: 'MNX Price', value: '$0.0045', icon: TrendingUp, change: '+3%' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-bold mb-1">
            Welcome, <span className="gradient-text">{user?.username}</span>
          </h1>
          <p className="text-sm text-muted-foreground">Your mining dashboard</p>
        </div>

        {/* Balance Card */}
        <Link 
          to="/wallet" 
          className="glass-card p-4 flex items-center justify-between animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/20">
              <Wallet className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p className="font-display text-2xl font-bold gradient-gold-text">{user?.balance || 0} MNX</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Mined</p>
            <p className="font-display text-lg font-bold text-primary">{user?.totalMined || 0}</p>
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-primary/20">
                  <stat.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-green-500 font-medium">{stat.change}</span>
              </div>
              <p className="text-lg font-display font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link to="/mining" className="glass-card p-4 hover:border-primary/50 transition-all group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent w-fit mb-3 group-hover:scale-110 transition-transform">
              <Pickaxe className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-base font-bold">Start Mining</h3>
            <p className="text-xs text-muted-foreground">Earn 20 MNX/session</p>
          </Link>
          
          <Link to="/games" className="glass-card p-4 hover:border-accent/50 transition-all group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-base font-bold">Play Games</h3>
            <p className="text-xs text-muted-foreground">Boost mining rate</p>
          </Link>
        </div>

        {/* About MINEX */}
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            About MINEX
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Revolutionary cloud mining platform. Earn MNX cryptocurrency by participating in our mining network.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-medium text-sm">Secure</p>
              <p className="text-xs text-muted-foreground">Enterprise-grade</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <Zap className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="font-medium text-sm">Fast</p>
              <p className="text-xs text-muted-foreground">Instant rewards</p>
            </div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <SponsorsPanel />
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Dashboard;