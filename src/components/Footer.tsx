import React from 'react';
import { Pickaxe, Instagram, Mail, Headphones } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-6 mt-8">
      <div className="container mx-auto px-4">
        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <a 
            href="https://instagram.com/minex" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Instagram</span>
          </a>
          <a 
            href="mailto:support@minex.com"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Email</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Headphones className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Support</span>
          </a>
        </div>

        {/* Logo and Copyright */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Pickaxe className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold gradient-text">MINEX</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2025 MINEX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
