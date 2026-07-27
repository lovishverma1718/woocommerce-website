import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={interactive ? { y: -4, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
      className={cn(
        'rounded-2xl glass-card p-6 relative overflow-hidden',
        interactive && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
