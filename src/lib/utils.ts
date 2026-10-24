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

export const STORE_STATUS_TEXT = {
  open: 'Open Now (10am–11pm)',
  closed: 'Opening Today at 10:00 AM',
} as const;

/** Current hour (0 to 23) in Abbotsford, BC, whatever the visitor's own time zone is. */
function currentStoreHour(): number {
  try {
    const hour = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Vancouver',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(new Date());
    const parsed = parseInt(hour, 10);
    if (!Number.isNaN(parsed)) return parsed % 24;
  } catch {
    // Very old browsers without time zone support: fall back to the device clock.
  }
  return new Date().getHours();
}

export function isStoreOpen(): { isOpen: boolean; text: string } {
  const hours = currentStoreHour();
  // Open 10 AM (10) to 11 PM (23)
  const isOpen = hours >= BRAND.hoursOpen && hours < BRAND.hoursClose;
  return {
    isOpen,
    text: isOpen ? STORE_STATUS_TEXT.open : STORE_STATUS_TEXT.closed,
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
