import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Pickaxe, Wallet, Gamepad2, Users } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/mining', label: 'Mine', icon: Pickaxe, isCenter: true },
    { path: '/referrals', label: 'Refer', icon: Users },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-end justify-around h-20 px-1 pb-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 transition-all duration-200"
          >
            {item.isCenter ? (
              <div className="relative -top-5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-br from-primary to-accent' 
                    : 'bg-gradient-to-br from-primary/80 to-accent/80'
                }`}
                style={{
                  boxShadow: isActive(item.path) 
                    ? '0 0 20px hsl(var(--primary) / 0.5)' 
                    : '0 4px 12px rgba(0,0,0,0.3)'
                }}
                >
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-colors ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center pt-2">
                <item.icon className={`w-5 h-5 mb-1 transition-colors ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
