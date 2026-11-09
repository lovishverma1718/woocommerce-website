import { DELIVERY_ZONES } from '../lib/constants';

const chilliwack = DELIVERY_ZONES.find(z => z.city === 'Chilliwack')!;
const time = chilliwack.estimatedTime.replace(/\s+/g, ' ');

/** Shown on /weed-delivery-chilliwack and used for its FAQPage schema (kept identical). */
export const CHILLIWACK_FAQS = [
  { question: 'Do you deliver weed to Chilliwack?', answer: `Yes. EliteBud delivers same day across Chilliwack, including Sardis, Vedder Crossing and Promontory. Most orders arrive in ${time}.` },
  { question: 'What is the minimum order for Chilliwack delivery?', answer: `The minimum order for Chilliwack is $${chilliwack.minOrder}, and delivery is free on orders over $${chilliwack.freeDeliveryThreshold}.` },
  { question: 'How do I pay for my order?', answer: 'You can pay by Interac e-Transfer or with cash on delivery.' },
  { question: 'Do I need ID to receive my order?', answer: 'Yes. You must be 19 or older and show valid government photo ID when your order is delivered.' },
];
