import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Pickaxe, Coins, Shield, Zap, ArrowRight, Users, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Pickaxe,
      title: 'Cloud Mining',
      description: 'Mine cryptocurrency without expensive hardware. Just click and earn.',
    },
    {
      icon: Coins,
      title: 'Earn MNX Tokens',
      description: 'Collect MNX coins every 2 hours with our automated mining system.',
    },
    {
      icon: Shield,
      title: 'Secure Wallet',
      description: 'Your earnings are protected with military-grade encryption.',
    },
    {
      icon: Zap,
      title: 'Instant Rewards',
      description: 'Get your mining rewards immediately after each session completes.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Miners' },
    { value: '2.5M', label: 'MNX Mined' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Pickaxe className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">MINEX</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button variant="mining" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Start mining in seconds</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            The Future of{' '}
            <span className="gradient-text">Crypto Mining</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Mine MNX tokens directly from your browser. No hardware required, no complex setup. 
            Just click and earn cryptocurrency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="mining" size="xl" onClick={() => navigate('/auth')}>
              <Pickaxe className="w-5 h-5" />
              Start Mining Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate('/auth')}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Floating Coin Animation */}
        <div className="relative mt-16">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-float shadow-2xl">
            <Coins className="w-16 h-16 text-primary-foreground" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-primary/30 blur-2xl animate-pulse" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-6 text-center animate-fade-in"
              style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
            >
              <p className="font-display text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">MINEX</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the easiest way to earn cryptocurrency with our innovative cloud mining platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-6 text-center hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Mining?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of miners earning MNX tokens every day. Sign up now and get your first reward within 2 hours.
          </p>
          <Button variant="mining" size="xl" onClick={() => navigate('/auth')}>
            <Users className="w-5 h-5" />
            Join MINEX Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a 
                href="https://instagram.com/minex" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">Instagram</span>
              </a>
              <a 
                href="mailto:support@minex.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">Email</span>
              </a>
              <a 
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">Support</span>
              </a>
            </div>
            
            {/* Logo and Copyright */}
            <div className="flex items-center gap-2">
              <Pickaxe className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-bold">MINEX</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © 2025 MINEX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
