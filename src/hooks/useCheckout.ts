import { useMutation } from '@tanstack/react-query';
import { CommerceService } from '../services/commerceService';
import { CheckoutPayload, Order } from '../types';
import { DELIVERY_ZONES } from '../lib/constants';

export function useCheckout() {
  return useMutation<Order, Error, CheckoutPayload>({
    mutationFn: (payload: CheckoutPayload) => CommerceService.processOrder(payload),
  });
}

export function validateDeliveryPostalCode(postalCode: string) {
  const formatted = postalCode.trim().toUpperCase().substring(0, 3);
  const matchingZone = DELIVERY_ZONES.find(zone => zone.postalCodes.includes(formatted));
  if (matchingZone) {
    return {
      eligible: true,
      zone: matchingZone,
      message: `Direct same-day delivery confirmed for ${matchingZone.city} (${matchingZone.estimatedTime}).`,
    };
  }
  return {
    eligible: false,
    zone: null,
    message: 'Delivery address outside core local zones. Express courier dispatch available upon request.',
  };
}
