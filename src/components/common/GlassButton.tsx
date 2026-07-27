import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'glass' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest/20 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5 shadow-luxury',
  };

  const variantStyles = {
    primary: 'bg-forest text-white hover:bg-forest-hover shadow-lg shadow-forest/15 hover:shadow-forest/25 active:scale-[0.98]',
    secondary: 'bg-emerald text-white hover:bg-emerald-light shadow-md active:scale-[0.98]',
    gold: 'bg-gold text-forest font-semibold hover:bg-gold-hover shadow-md hover:shadow-gold/20 active:scale-[0.98]',
    glass: 'glass-button font-medium text-forest hover:border-forest/40 active:scale-[0.98]',
    outline: 'border border-border text-charcoal hover:border-forest hover:text-forest bg-transparent active:scale-[0.98]',
  };

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
