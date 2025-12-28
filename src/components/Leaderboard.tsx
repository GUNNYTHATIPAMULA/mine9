import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardUser {
  id: string;
  username: string;
  totalMined: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('minex_users') || '[]');
    const sorted = savedUsers
      .map((u: any) => ({
        id: u.id,
        username: u.username,
        totalMined: u.totalMined || 0,
      }))
      .sort((a: any, b: any) => b.totalMined - a.totalMined)
      .slice(0, 10)
      .map((u: any, idx: number) => ({ ...u, rank: idx + 1 }));

    setLeaders(sorted);

    // Find current user rank
    const allSorted = savedUsers
      .map((u: any) => ({ id: u.id, totalMined: u.totalMined || 0 }))
      .sort((a: any, b: any) => b.totalMined - a.totalMined);
    
    const rank = allSorted.findIndex((u: any) => u.id === user?.id);
    if (rank !== -1) setUserRank(rank + 1);
  }, [user?.id]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-600/30';
      default: return 'bg-secondary/30';
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold">Leaderboard</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Top miners this season</p>
        </div>
      </div>

      {userRank && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-xs text-muted-foreground">Your Rank</p>
          <p className="font-display text-xl font-bold text-primary">#{userRank}</p>
        </div>
      )}

      <div className="space-y-2">
        {leaders.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">No miners yet. Be the first!</p>
        ) : (
          leaders.map((leader) => (
            <div
              key={leader.id}
              className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg border ${getRankBg(leader.rank)} ${leader.id === user?.id ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(leader.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {leader.username}
                  {leader.id === user?.id && <span className="text-primary ml-1">(You)</span>}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-sm gradient-gold-text">{leader.totalMined}</p>
                <p className="text-xs text-muted-foreground">MNX</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
