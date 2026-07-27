import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';

export interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/shop?category=${category.slug}`}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-80 rounded-2xl overflow-hidden glass-card border border-border shadow-lg cursor-pointer"
      >
        {/* Background Image */}
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent group-hover:via-charcoal/50 transition-all duration-300" />

        {/* Content Box */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
          
          {/* Top Pill */}
          <div className="flex justify-between items-start">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-white border border-white/30">
              {category.count} Products
            </span>
            
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-forest transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          {/* Bottom Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-2xl font-bold tracking-tight group-hover:text-gold-light transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-light">
              {category.description}
            </p>
          </div>

        </div>
      </motion.div>
    </Link>
  );
};
