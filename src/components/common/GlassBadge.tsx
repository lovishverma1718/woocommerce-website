import React from 'react';
import { cn } from '../../lib/utils';

export interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'emerald' | 'gold' | 'surface' | 'strain' | 'danger';
  className?: string;
  icon?: React.ReactNode;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'forest',
  className,
  icon,
}) => {
  const variantStyles = {
    forest: 'glass-badge text-forest font-medium',
    emerald: 'bg-emerald/10 border border-emerald/20 text-emerald font-medium',
    gold: 'glass-badge-gold text-gold-hover font-semibold',
    surface: 'bg-surface border border-border text-charcoal-muted text-xs font-normal',
    strain: 'bg-forest/5 border border-forest/10 text-forest text-xs font-semibold uppercase tracking-wider',
    danger: 'bg-red-50 border border-red-200 text-accent-danger font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-colors duration-200 select-none',
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
