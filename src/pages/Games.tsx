import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Gamepad2, Zap, Target, Puzzle, Trophy, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  boostPercent: number;
  cooldown: number; // in hours
  color: string;
}

const games: Game[] = [
  {
    id: 'tap_rush',
    name: 'Tap Rush',
    description: 'Tap as fast as you can in 10 seconds',
    icon: Zap,
    boostPercent: 2,
    cooldown: 4,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'lucky_spin',
    name: 'Lucky Spin',
    description: 'Spin the wheel for bonus rewards',
    icon: Target,
    boostPercent: 5,
    cooldown: 8,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'memory_match',
    name: 'Memory Match',
    description: 'Match pairs to boost mining rate',
    icon: Puzzle,
    boostPercent: 3,
    cooldown: 6,
    color: 'from-cyan-500 to-blue-500'
  },
];

const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameData, setGameData] = useState<Record<string, { lastPlayed: number, boost: number }>>({});
  const [totalBoost, setTotalBoost] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [gameTimer, setGameTimer] = useState(0);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('minex_game_boosts');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGameData(parsed);
      
      // Calculate total active boost
      const now = Date.now();
      let boost = 0;
      Object.entries(parsed).forEach(([gameId, data]: [string, any]) => {
        const game = games.find(g => g.id === gameId);
        if (game && now - data.lastPlayed < game.cooldown * 60 * 60 * 1000) {
          boost += data.boost;
        }
      });
      setTotalBoost(boost);
      
      // Save total boost to localStorage for mining timer
      localStorage.setItem('minex_mining_boost', JSON.stringify(boost));
    }
  }, []);

  const canPlay = (game: Game) => {
    const data = gameData[game.id];
    if (!data) return true;
    return Date.now() - data.lastPlayed >= game.cooldown * 60 * 60 * 1000;
  };

  const getCooldownRemaining = (game: Game) => {
    const data = gameData[game.id];
    if (!data) return 0;
    const elapsed = Date.now() - data.lastPlayed;
    const remaining = game.cooldown * 60 * 60 * 1000 - elapsed;
    return Math.max(0, remaining);
  };

  const formatCooldown = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const startGame = (gameId: string) => {
    setActiveGame(gameId);
    if (gameId === 'tap_rush') {
      setTapCount(0);
      setGameTimer(10);
      const interval = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameId === 'lucky_spin') {
      setSpinResult(null);
    }
  };

  const handleTap = () => {
    if (gameTimer > 0) {
      setTapCount(prev => prev + 1);
    }
  };

  const finishTapRush = () => {
    const boost = Math.min(5, Math.floor(tapCount / 20)); // 0-5% boost based on taps
    completeGame('tap_rush', boost);
  };

  const spinWheel = () => {
    const result = Math.random() * 100;
    let boost = 0;
    if (result < 50) boost = 1;
    else if (result < 80) boost = 3;
    else if (result < 95) boost = 5;
    else boost = 10;
    
    setSpinResult(boost);
    setTimeout(() => completeGame('lucky_spin', boost), 1500);
  };

  const playMemoryMatch = () => {
    // Simplified - just give random boost
    const boost = Math.floor(Math.random() * 4) + 1;
    completeGame('memory_match', boost);
  };

  const completeGame = (gameId: string, boost: number) => {
    const newGameData = {
      ...gameData,
      [gameId]: { lastPlayed: Date.now(), boost }
    };
    setGameData(newGameData);
    localStorage.setItem('minex_game_boosts', JSON.stringify(newGameData));
    
    // Recalculate total boost
    const now = Date.now();
    let newTotalBoost = 0;
    Object.entries(newGameData).forEach(([gId, data]: [string, any]) => {
      const game = games.find(g => g.id === gId);
      if (game && now - data.lastPlayed < game.cooldown * 60 * 60 * 1000) {
        newTotalBoost += data.boost;
      }
    });
    setTotalBoost(newTotalBoost);
    localStorage.setItem('minex_mining_boost', JSON.stringify(newTotalBoost));
    
    toast.success(`Game complete! +${boost}% mining boost activated!`);
    setActiveGame(null);
    setTapCount(0);
    setGameTimer(0);
    setSpinResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col pt-14 pb-24 bg-background">
      <TopHeader />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-1">
            <span className="gradient-text">Game Zone</span>
          </h1>
          <p className="text-muted-foreground text-sm">Play games to boost mining rate!</p>
        </div>

        {/* Total Boost */}
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-primary">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Mining Boost</p>
                <p className="font-display text-2xl font-bold gradient-gold-text">+{totalBoost}%</p>
              </div>
            </div>
            <Trophy className="w-8 h-8 text-accent/50" />
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-3">
          {games.map((game, idx) => {
            const available = canPlay(game);
            const cooldown = getCooldownRemaining(game);
            const currentBoost = gameData[game.id]?.boost || 0;
            
            return (
              <div
                key={game.id}
                className="glass-card p-4 animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center flex-shrink-0`}>
                    <game.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-bold">{game.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{game.description}</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-accent" />
                      <span className="text-xs font-medium">Up to +{game.boostPercent}%</span>
                      {!available && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatCooldown(cooldown)}
                        </span>
                      )}
                      {currentBoost > 0 && !available && (
                        <span className="text-xs text-accent">Active: +{currentBoost}%</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant={available ? 'mining' : 'secondary'}
                    size="sm"
                    disabled={!available}
                    onClick={() => startGame(game.id)}
                  >
                    {available ? 'Play' : 'Wait'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Game Modal */}
        {activeGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="glass-card p-6 max-w-sm w-full animate-scale-in">
              {activeGame === 'tap_rush' && (
                <div className="text-center">
                  <h3 className="font-display text-xl font-bold mb-4">Tap Rush!</h3>
                  {gameTimer > 0 ? (
                    <>
                      <div className="text-3xl font-display font-bold text-primary mb-4">{gameTimer}s</div>
                      <Button
                        variant="mining"
                        size="xl"
                        className="w-full h-28 text-xl mb-4"
                        onClick={handleTap}
                      >
                        TAP! ({tapCount})
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-xl font-display font-bold mb-2">Time's up!</div>
                      <div className="text-3xl font-display font-bold gradient-gold-text mb-4">{tapCount} taps</div>
                      <Button variant="mining" className="w-full" onClick={finishTapRush}>
                        Claim +{Math.min(5, Math.floor(tapCount / 20))}% Boost
                      </Button>
                    </>
                  )}
                </div>
              )}

              {activeGame === 'lucky_spin' && (
                <div className="text-center">
                  <h3 className="font-display text-xl font-bold mb-4">Lucky Spin!</h3>
                  <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                    {spinResult !== null ? (
                      <span className="text-2xl font-display font-bold text-white">+{spinResult}%</span>
                    ) : (
                      <Target className="w-14 h-14 text-white" />
                    )}
                  </div>
                  {spinResult === null && (
                    <Button variant="mining" className="w-full" onClick={spinWheel}>
                      Spin the Wheel!
                    </Button>
                  )}
                </div>
              )}

              {activeGame === 'memory_match' && (
                <div className="text-center">
                  <h3 className="font-display text-xl font-bold mb-4">Memory Match!</h3>
                  <Puzzle className="w-16 h-16 mx-auto mb-5 text-cyan-500" />
                  <p className="text-muted-foreground text-sm mb-4">Match pairs to win!</p>
                  <Button variant="mining" className="w-full" onClick={playMemoryMatch}>
                    Quick Match!
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setActiveGame(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Games;