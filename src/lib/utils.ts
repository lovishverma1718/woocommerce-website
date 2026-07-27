import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BRAND } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function isStoreOpen(): { isOpen: boolean; text: string } {
  const now = new Date();
  const hours = now.getHours();
  // Open 10 AM (10) to 11 PM (23)
  const isOpen = hours >= BRAND.hoursOpen && hours < BRAND.hoursClose;
  return {
    isOpen,
    text: isOpen ? 'Open Now (10am–11pm)' : 'Opening Today at 10:00 AM',
  };
}

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal >= BRAND.freeDeliveryThreshold || subtotal === 0) {
    return 0;
  }
  return BRAND.standardDeliveryFee;
}

export function getDeliveryProgress(subtotal: number): { percent: number; remaining: number } {
  if (subtotal >= BRAND.freeDeliveryThreshold) {
    return { percent: 100, remaining: 0 };
  }
  const remaining = BRAND.freeDeliveryThreshold - subtotal;
  const percent = Math.min(100, Math.round((subtotal / BRAND.freeDeliveryThreshold) * 100));
  return { percent, remaining };
}
