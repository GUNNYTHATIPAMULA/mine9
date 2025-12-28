import React from 'react';
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownRight, Copy, Check, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const walletAddress = user?.id ? `0x${user.id.replace(/-/g, '').slice(0, 32)}` : '';

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const transactions = [
    { type: 'in', amount: 25, time: '2 hours ago' },
    { type: 'in', amount: 18, time: '5 hours ago' },
    { type: 'out', amount: 10, time: '1 day ago' },
    { type: 'in', amount: 42, time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <WalletIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <h2 className="font-display text-3xl font-bold gradient-gold-text">
              {user?.balance.toLocaleString() || 0} MNX
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <code className="text-xs text-muted-foreground flex-1 truncate">
            {walletAddress}
          </code>
          <Button variant="ghost" size="sm" onClick={copyAddress}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Mined</span>
          </div>
          <p className="font-display text-xl font-bold">{user?.totalMined || 0} MNX</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Mining Rate</span>
          </div>
          <p className="font-display text-xl font-bold">~25 MNX/session</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tx.type === 'in' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {tx.type === 'in' ? (
                    <ArrowDownRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tx.type === 'in' ? 'Mining Reward' : 'Transfer'}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
              </div>
              <span className={`font-display font-bold ${tx.type === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                {tx.type === 'in' ? '+' : '-'}{tx.amount} MNX
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
