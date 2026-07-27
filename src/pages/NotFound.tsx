import React from 'react';
import { Link } from 'react-router-dom';
import { GlassButton } from '../components/common/GlassButton';
import { Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-32 max-w-md mx-auto px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-forest/5 flex items-center justify-center text-forest mx-auto">
        <Sparkles className="w-10 h-10 text-gold" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-bold text-gold-hover uppercase tracking-widest block">404 Error</span>
        <h1 className="text-4xl font-bold text-forest">Page Not Found</h1>
        <p className="text-sm text-charcoal-muted leading-relaxed">
          The page or reserve item you are looking for has moved or is no longer available.
        </p>
      </div>
      <Link to="/">
        <GlassButton variant="primary" size="lg" className="w-full">
          Return to Homepage
        </GlassButton>
      </Link>
    </div>
  );
};
