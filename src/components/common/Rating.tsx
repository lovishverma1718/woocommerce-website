import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RatingProps {
  rating: number;
  count?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  count,
  showText = true,
  size = 'sm',
  className,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center text-gold">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              iconSizes[size],
              star <= Math.round(rating)
                ? 'fill-gold text-gold'
                : 'text-border fill-transparent'
            )}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-charcoal ml-0.5">
          {rating.toFixed(1)} {count !== undefined && <span className="text-charcoal-muted font-normal">({count})</span>}
        </span>
      )}
    </div>
  );
};
