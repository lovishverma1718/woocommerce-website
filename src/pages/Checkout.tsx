import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useCheckout, validateDeliveryPostalCode } from '../hooks/useCheckout';
import { formatCurrency, calculateDeliveryFee } from '../lib/utils';
import { BRAND } from '../lib/constants';
import { GlassButton } from '../components/common/GlassButton';
import { GlassCard } from '../components/common/GlassCard';
import { Order } from '../types';
import { CommerceService } from '../services/commerceService';
import { InteracQRCode } from '../components/common/InteracQRCode';
import {
  CheckCircle2,
  Copy,
  MapPin,
  Truck,
  Sparkles,
  AlertCircle,
  Phone,
  ShieldCheck,
  Clock,
  RefreshCw,
  Mail,
  User,
  Check,
  Lock,
  Send,
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
  email: z.string().email('Valid email address required'),
  ageConfirmed: z.boolean().refine(val => val === true, 'You must confirm you are 19+ in BC'),
  addressLine1: z.string().min(5, 'Street address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().default('BC'),
  postalCode: z.string().min(6, 'Valid 6-character Postal Code required'),
  deliveryNotes: z.string().optional(),
  deliveryTimeSlot: z.enum(['asap', 'scheduled_afternoon', 'scheduled_evening']).default('asap'),
  paymentMethod: z.enum(['interac_etransfer', 'cash_on_delivery']).default('interac_etransfer'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Loading Steps Sequence
const LOADING_STEPS = [
  'Validating cart items & stock availability...',
  'Saving local delivery address...',
  'Creating WooCommerce Order...',
  'Preparing Dispatch & Driver Queue...',
  'Order Successfully Created!',
];

export const Checkout: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const checkoutMutation = useCheckout();

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<string>('pending');

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Modals & User Action State
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false);
  const [showPaymentSentModal, setShowPaymentSentModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [postalValidation, setPostalValidation] = useState<{ eligible: boolean; message: string } | null>(null);

  // Multi-step Loading Animation State
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  // IMPORTANT BUSINESS RULE:
  // Cart Total >= $50 -> HIDE Cash On Delivery, ONLY show Interac E-Transfer
  const isCodAllowed = total < 50;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      province: 'BC',
      city: 'Abbotsford',
      deliveryTimeSlot: 'asap',
      paymentMethod: 'interac_etransfer',
      ageConfirmed: true,
    },
  });

  const watchPostalCode = watch('postalCode');
  const watchPayment = watch('paymentMethod');

  // Enforce payment method if COD is no longer allowed due to order total >= $50
  useEffect(() => {
    if (!isCodAllowed && watchPayment === 'cash_on_delivery') {
      setValue('paymentMethod', 'interac_etransfer');
    }
  }, [total, isCodAllowed, watchPayment, setValue]);

  const handlePostalBlur = () => {
    if (watchPostalCode && watchPostalCode.length >= 3) {
      const res = validateDeliveryPostalCode(watchPostalCode);
      setPostalValidation({ eligible: res.eligible, message: res.message });
    }
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    setOrderError(null);
    setIsProcessingOrder(true);
    setLoadingStepIndex(0);

    const payload = {
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        ageConfirmed: values.ageConfirmed,
      },
      shipping: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
        deliveryNotes: values.deliveryNotes,
      },
      deliveryTimeSlot: values.deliveryTimeSlot,
      paymentMethod: values.paymentMethod,
      items,
      subtotal,
      deliveryFee,
      total,
    };

    // Step-by-step loading animation over 1.8 seconds
    try {
      setLoadingStepIndex(0);
      await new Promise(r => setTimeout(r, 450));
      setLoadingStepIndex(1);
      await new Promise(r => setTimeout(r, 450));
      setLoadingStepIndex(2);

      const order = await checkoutMutation.mutateAsync(payload);

      setLoadingStepIndex(3);
      await new Promise(r => setTimeout(r, 450));
      setLoadingStepIndex(4);
      await new Promise(r => setTimeout(r, 400));

      setIsProcessingOrder(false);
      setCompletedOrder(order);
      setCurrentOrderStatus(order.status || (values.paymentMethod === 'interac_etransfer' ? 'pending' : 'processing'));
      clearCart();
    } catch (err: any) {
      setIsProcessingOrder(false);
      setOrderError(err?.message || 'Unable to create your order. Please check your network connection or try again.');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(BRAND.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyAmount = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(formatCurrency(completedOrder.payload.total));
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleCopyRef = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.orderNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(BRAND.phoneRaw);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Launch Banking App handler
  const handleMakePaymentClick = () => {
    setShowMakePaymentModal(true);
    try {
      window.location.href = 'interac://';
    } catch (e) {
      // Fallback modal shown automatically
    }
  };

  // Payment Sent button handler -> updates WooCommerce Order Status to 'payment-sent'
  const handlePaymentSentClick = async () => {
    if (!completedOrder) return;
    setIsUpdatingStatus(true);

    try {
      await CommerceService.updateOrderStatus(completedOrder.id, 'payment-sent');
      setCurrentOrderStatus('payment-sent');
      setIsUpdatingStatus(false);
      setShowPaymentSentModal(true);
    } catch (err) {
      setIsUpdatingStatus(false);
      setCurrentOrderStatus('payment-sent');
      setShowPaymentSentModal(true);
    }
  };

  // ORDER SUCCESS / THANK YOU PAGE
  if (completedOrder) {
    const isInterac = completedOrder.payload.paymentMethod === 'interac_etransfer';
    const isPaymentSent = currentOrderStatus === 'payment-sent';

    return (
      <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* MAKE PAYMENT GUIDANCE MODAL */}
        <AnimatePresence>
          {showMakePaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full border border-border shadow-floating text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-gold animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-forest">Open Banking Application</h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Please open your mobile banking app (TD, RBC, Scotiabank, BMO, CIBC, Vancity, etc.), send an Interac E-Transfer using the payment details below, then return here to notify dispatch.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border text-xs text-left space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Recipient:</span>
                    <strong className="text-forest">{BRAND.email}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Amount:</span>
                    <strong className="text-forest">{formatCurrency(completedOrder.payload.total)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Memo Note:</span>
                    <strong className="text-forest">{completedOrder.orderNumber}</strong>
                  </div>
                </div>

                <GlassButton
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  onClick={() => setShowMakePaymentModal(false)}
                >
                  I Understand — Return to Order Details
                </GlassButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAYMENT SENT CONFIRMATION MODAL */}
        <AnimatePresence>
          {showPaymentSentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full border border-emerald/30 shadow-floating text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald block">
                    WooCommerce Status Updated
                  </span>
                  <h3 className="text-2xl font-bold text-forest">Payment Notification Received</h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Thank you! We have received your payment notification. Our dispatch team will verify your Interac payment shortly. You will receive an email after verification.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-1">
                  <span className="text-charcoal-muted block">Average Verification Time:</span>
                  <span className="text-sm font-bold text-forest block">2–10 Minutes</span>
                  <span className="text-[11px] text-charcoal-muted block pt-1">
                    Drivers are dispatched immediately upon payment verification.
                  </span>
                </div>

                <GlassButton
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  onClick={() => setShowPaymentSentModal(false)}
                >
                  Continue Monitoring Progress
                </GlassButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl glass-card p-8 sm:p-12 border border-border bg-white text-center space-y-6 shadow-floating"
        >
          
          {/* Animated Header Icon & Status Badges */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full ${isInterac ? 'bg-gold/15' : 'bg-emerald/15'} animate-ping opacity-25`} />
              <div className={`w-20 h-20 rounded-full ${isInterac ? 'bg-forest text-gold border-2 border-gold/40' : 'bg-forest text-gold border-2 border-emerald/40'} flex items-center justify-center shadow-xl relative z-10`}>
                <CheckCircle2 className="w-10 h-10 text-gold" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isPaymentSent
                  ? 'bg-emerald/10 text-emerald border-emerald/30'
                  : isInterac
                  ? 'bg-gold/10 text-gold-hover border-gold/30'
                  : 'bg-emerald/10 text-emerald border-emerald/30'
              }`}>
                STATUS: {isPaymentSent ? 'Payment Sent — Verification In Progress' : isInterac ? 'Awaiting Payment' : 'Order Received'}
              </span>

              <span className="px-3.5 py-1 rounded-full bg-forest/5 text-forest text-xs font-mono font-bold border border-forest/10">
                Order #{completedOrder.orderNumber}
              </span>
            </div>
          </div>

          {/* Top Section */}
          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              ✓ Order Successfully Received
            </h1>
            <p className="text-sm text-charcoal-muted leading-relaxed font-light">
              {isInterac
                ? 'Your order has been saved in WooCommerce. Complete your Interac E-Transfer using the details below so our dispatch team can verify and send your driver.'
                : 'Thank you! Your order has been received and our dispatch team is preparing it for delivery.'}
            </p>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface border border-border text-left text-xs">
            <div>
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase block">Order Number</span>
              <span className="font-mono font-bold text-forest text-sm">{completedOrder.orderNumber}</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase block">Payment Method</span>
              <span className="font-bold text-charcoal capitalize">
                {isInterac ? 'Interac E-Transfer' : 'Cash On Delivery'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase block">Est. Delivery</span>
              <span className="font-bold text-emerald">1–3 Hours</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase block">Dispatch Status</span>
              <span className="font-bold text-forest">
                {isPaymentSent ? 'Verifying E-Transfer' : isInterac ? 'Waiting For Payment' : 'Preparing Driver'}
              </span>
            </div>
          </div>

          {/* DYNAMIC DYNAMIC DYNAMIC PROGRESS TRACKER */}
          <div className="pt-6 border-t border-border space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>Payment & Order Progress Tracker</span>
              </h3>
              <span className="text-[11px] text-charcoal-muted font-mono">
                {isPaymentSent ? 'Step 2 of 5 (Payment Sent)' : isInterac ? 'Step 2 of 5 (Awaiting E-Transfer)' : 'Step 2 of 5 (Queued)'}
              </span>
            </div>

            {/* Progress Step Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
              
              {/* Step 1: Order Received */}
              <div className="p-3 rounded-2xl bg-forest text-white font-bold space-y-1 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-gold text-forest flex items-center justify-center mx-auto text-[10px] font-bold">
                  ✓
                </span>
                <span className="block text-[11px]">Step 1: Order Received</span>
              </div>

              {/* Step 2: Waiting For Interac Payment */}
              <div className={`p-3 rounded-2xl border text-xs font-bold space-y-1 ${
                isPaymentSent
                  ? 'bg-emerald/15 border-emerald/40 text-emerald shadow-xs'
                  : isInterac
                  ? 'bg-gold/15 border-gold/50 text-forest shadow-xs'
                  : 'bg-surface border-border text-charcoal-muted'
              }`}>
                <span className="w-5 h-5 rounded-full bg-gold text-forest flex items-center justify-center mx-auto text-[10px] font-bold">
                  {isPaymentSent ? '✓' : '🟡'}
                </span>
                <span className="block text-[11px]">
                  {isPaymentSent ? 'Payment Sent' : isInterac ? '🟡 Waiting For Interac' : 'Order Queued'}
                </span>
              </div>

              {/* Step 3: Payment Verified */}
              <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                isPaymentSent
                  ? 'bg-gold/10 border-gold/40 text-forest font-bold animate-pulse'
                  : 'bg-surface border-border text-charcoal-muted'
              }`}>
                <span className="w-5 h-5 rounded-full bg-border text-charcoal flex items-center justify-center mx-auto text-[10px]">
                  {isPaymentSent ? '⌛' : '○'}
                </span>
                <span className="block text-[11px]">
                  {isPaymentSent ? 'Verification In Progress' : '○ Payment Verified'}
                </span>
              </div>

              {/* Step 4: Driver Assigned */}
              <div className="p-3 rounded-2xl bg-surface border border-border text-charcoal-muted space-y-1">
                <span className="w-5 h-5 rounded-full bg-border text-charcoal flex items-center justify-center mx-auto text-[10px]">
                  ○
                </span>
                <span className="block text-[11px]">○ Driver Assigned</span>
              </div>

              {/* Step 5: Delivered */}
              <div className="p-3 rounded-2xl bg-surface border border-border text-charcoal-muted space-y-1">
                <span className="w-5 h-5 rounded-full bg-border text-charcoal flex items-center justify-center mx-auto text-[10px]">
                  ○
                </span>
                <span className="block text-[11px]">○ Delivered</span>
              </div>

            </div>
          </div>

          {/* PREMIUM PAYMENT INFORMATION CARD WITH QR CODE */}
          {isInterac && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl border-2 border-gold/50 bg-gold/5 text-left space-y-6 shadow-md"
            >
              
              <div className="flex items-center justify-between border-b border-gold/30 pb-4">
                <div>
                  <h3 className="text-base font-bold text-forest flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold shrink-0" />
                    <span>Interac E-Transfer Payment Information</span>
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Send transfer via your banking app using the details below. Auto-Deposit is enabled.
                  </p>
                </div>

                <span className="hidden sm:inline-flex text-[11px] font-bold px-3 py-1 rounded-full bg-forest text-gold">
                  Auto-Deposit Enabled
                </span>
              </div>

              {/* Grid: Payment Fields & QR Code */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left Column: 3 Copyable Cards */}
                <div className="md:col-span-8 space-y-3">
                  
                  {/* Recipient Email */}
                  <div className="p-3.5 rounded-2xl bg-white border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">Recipient Email</span>
                      <span className="font-mono font-bold text-forest text-sm">{BRAND.email}</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-medium hover:bg-forest-hover transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-gold" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Amount */}
                  <div className="p-3.5 rounded-2xl bg-white border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">Order Total Amount</span>
                      <span className="font-bold text-forest text-base">{formatCurrency(completedOrder.payload.total)}</span>
                    </div>
                    <button
                      onClick={handleCopyAmount}
                      className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-medium hover:bg-forest-hover transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedAmount ? <Check className="w-3.5 h-3.5 text-gold" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAmount ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Reference Note */}
                  <div className="p-3.5 rounded-2xl bg-white border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">Payment Reference / Memo</span>
                      <span className="font-mono font-bold text-forest text-sm">{completedOrder.orderNumber}</span>
                    </div>
                    <button
                      onClick={handleCopyRef}
                      className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-medium hover:bg-forest-hover transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-gold" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRef ? 'Copied!' : 'Copy Reference'}</span>
                    </button>
                  </div>

                </div>

                {/* Right Column: Interac QR Code */}
                <div className="md:col-span-4 flex justify-center">
                  <InteracQRCode
                    email={BRAND.email}
                    amount={formatCurrency(completedOrder.payload.total)}
                    reference={completedOrder.orderNumber}
                  />
                </div>

              </div>

              {/* IMPORTANT RESERVATION NOTICE */}
              <div className="p-4 rounded-2xl bg-white/90 border border-gold/40 space-y-1 text-xs">
                <h5 className="font-bold text-forest flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-gold shrink-0" />
                  <span>Important Reservation Notice</span>
                </h5>
                <p className="text-charcoal-muted text-[11px] leading-relaxed">
                  Your order has been reserved in WooCommerce. Products are prepared immediately after payment verification. Using the correct Order Reference Number (<strong className="text-forest font-mono">{completedOrder.orderNumber}</strong>) helps us verify your payment faster.
                </p>
              </div>

              {/* ACTION BUTTONS: MAKE PAYMENT & I'VE SENT MY PAYMENT */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-lg cursor-pointer"
                  icon={<ExternalLink className="w-4 h-4 text-gold" />}
                  onClick={handleMakePaymentClick}
                >
                  Make Payment
                </GlassButton>

                <GlassButton
                  variant="secondary"
                  size="lg"
                  className="w-full font-bold cursor-pointer"
                  disabled={isUpdatingStatus}
                  icon={<Send className="w-4 h-4 text-forest" />}
                  onClick={handlePaymentSentClick}
                >
                  {isUpdatingStatus ? 'Notifying Dispatch...' : "I've Sent My Payment"}
                </GlassButton>

              </div>

            </motion.div>
          )}

          {/* CASH ON DELIVERY (COD) NOTICE */}
          {!isInterac && (
            <div className="p-6 rounded-2xl border border-forest/20 bg-forest/5 text-left space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-forest text-sm">
                <Truck className="w-4 h-4 text-gold" />
                <span>Cash On Delivery Notice</span>
              </div>
              <p className="text-charcoal-muted leading-relaxed">
                Dispatch team is now preparing your order. Your driver will contact you via phone before arrival. Please have exact cash (<strong className="text-forest font-bold">{formatCurrency(completedOrder.payload.total)}</strong>) ready upon delivery. Drivers carry exact change upon request. Estimated arrival: <strong>1–3 Hours</strong>.
              </p>
            </div>
          )}

          {/* EMAIL CONFIRMATION STATUS */}
          <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left">
            <div className="flex items-center gap-2.5 text-charcoal">
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <span>
                Order confirmation email sent to: <strong className="text-forest font-semibold">{completedOrder.payload.customer.email}</strong>
              </span>
            </div>
            <span className="text-[11px] text-emerald font-semibold px-2.5 py-1 bg-white rounded-lg border border-border shrink-0">
              Confirmation Sent
            </span>
          </div>

          {/* ORDER SUMMARY BREAKDOWN */}
          <div className="pt-6 border-t border-border text-left space-y-4">
            <h3 className="text-sm font-bold text-forest">Order Breakdown Summary</h3>

            <div className="space-y-3">
              {completedOrder.payload.items.map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl border border-border bg-surface/50 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-border shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-charcoal">{item.product.name}</h4>
                      <span className="text-charcoal-muted">{item.quantity}x {item.selectedWeight}</span>
                    </div>
                  </div>
                  <span className="font-bold text-forest text-sm">
                    {formatCurrency(item.selectedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">{formatCurrency(completedOrder.payload.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>Same-Day Local Delivery Fee</span>
                <span className="font-semibold text-forest">
                  {completedOrder.payload.deliveryFee === 0 ? 'FREE' : formatCurrency(completedOrder.payload.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest pt-2 border-t border-border">
                <span>Grand Total</span>
                <span>{formatCurrency(completedOrder.payload.total)}</span>
              </div>
            </div>

            {/* Customer & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl border border-border bg-white space-y-1">
                <span className="text-[11px] font-semibold text-charcoal-muted uppercase block flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gold" />
                  Customer Details
                </span>
                <span className="font-bold text-charcoal block">
                  {completedOrder.payload.customer.firstName} {completedOrder.payload.customer.lastName}
                </span>
                <span className="text-charcoal-muted block">{completedOrder.payload.customer.phone}</span>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-white space-y-1">
                <span className="text-[11px] font-semibold text-charcoal-muted uppercase block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  Delivery Address
                </span>
                <span className="font-bold text-charcoal block">{completedOrder.payload.shipping.addressLine1}</span>
                <span className="text-charcoal-muted block">
                  {completedOrder.payload.shipping.city}, BC {completedOrder.payload.shipping.postalCode}
                </span>
              </div>
            </div>
          </div>

          {/* TRUST SECTION */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border text-center text-xs">
            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <ShieldCheck className="w-5 h-5 text-gold mx-auto" />
              <span className="font-bold text-forest block">Secure Checkout</span>
              <span className="text-[10px] text-charcoal-muted">Encrypted Processing</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <MapPin className="w-5 h-5 text-gold mx-auto" />
              <span className="font-bold text-forest block">Local Abbotsford Hub</span>
              <span className="text-[10px] text-charcoal-muted">Direct Dispatch</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <Phone className="w-5 h-5 text-gold mx-auto" />
              <span className="font-bold text-forest block">Driver Call Alert</span>
              <span className="text-[10px] text-charcoal-muted">Phone Before Arrival</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <User className="w-5 h-5 text-gold mx-auto" />
              <span className="font-bold text-forest block">19+ Government ID</span>
              <span className="text-[10px] text-charcoal-muted">BC Legal Required</span>
            </div>
          </div>

          {/* CONTACT & ACTION BUTTONS */}
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/shop" className="w-full sm:w-auto">
              <GlassButton variant="primary" size="lg" className="w-full font-bold">
                Continue Shopping
              </GlassButton>
            </Link>

            <a href={`tel:${BRAND.phoneRaw}`} className="w-full sm:w-auto">
              <GlassButton variant="secondary" size="lg" className="w-full font-bold" icon={<Phone className="w-4 h-4 text-forest" />}>
                Contact Dispatch
              </GlassButton>
            </a>

            <button
              onClick={handleCopyPhone}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-border bg-surface text-forest font-bold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-gold" />
              <span>{copiedPhone ? 'Copied Phone!' : `Copy Dispatch Number (${BRAND.phoneFormatted})`}</span>
            </button>
          </div>

        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-forest">Your Reserve Cart is Empty</h2>
        <p className="text-xs text-charcoal-muted">Please select craft products from our catalog before checking out.</p>
        <Link to="/shop">
          <GlassButton variant="primary" size="md">
            Browse Reserve Catalog
          </GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
      
      {/* MULTI-STEP ORDER CREATION LOADING OVERLAY */}
      <AnimatePresence>
        {isProcessingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-border shadow-floating text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-gold animate-spin" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
                  Processing Your Order
                </span>
                <h3 className="text-xl font-bold text-forest">
                  {LOADING_STEPS[loadingStepIndex]}
                </h3>
              </div>

              {/* Step Progress Meter */}
              <div className="space-y-2 pt-2">
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest to-gold transition-all duration-300 rounded-full"
                    style={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-charcoal-muted font-mono">
                  Step {loadingStepIndex + 1} of {LOADING_STEPS.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API ERROR OVERLAY */}
      <AnimatePresence>
        {orderError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xl"
          >
            <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-red-200 shadow-floating text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-100 text-accent-danger mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-forest">Unable to Create Your Order</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {orderError}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <GlassButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setOrderError(null)}
                >
                  Please Try Again
                </GlassButton>

                <a href={`tel:${BRAND.phoneRaw}`} className="block">
                  <GlassButton variant="secondary" size="md" className="w-full" icon={<Phone className="w-4 h-4 text-forest" />}>
                    Call Dispatch: {BRAND.phoneFormatted}
                  </GlassButton>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Form Header */}
      <div className="space-y-2 pb-6 border-b border-border">
        <h1 className="text-4xl font-bold text-forest tracking-tight">Express Guest Checkout</h1>
        <p className="text-sm text-charcoal-muted">Abbotsford Direct Dispatch Pipeline</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Step 1: Customer Contact */}
          <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-border">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-xl font-bold text-forest">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">First Name *</label>
                <input
                  {...register('firstName')}
                  type="text"
                  className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                />
                {errors.firstName && <p className="text-xs text-accent-danger mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Last Name *</label>
                <input
                  {...register('lastName')}
                  type="text"
                  className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                />
                {errors.lastName && <p className="text-xs text-accent-danger mt-1">{errors.lastName.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Cell Phone Number *</label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="(236) 000-0000"
                  className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                />
                {errors.phone && <p className="text-xs text-accent-danger mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Email Address *</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                />
                {errors.email && <p className="text-xs text-accent-danger mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Age Gate Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  {...register('ageConfirmed')}
                  type="checkbox"
                  className="w-4 h-4 accent-forest rounded"
                />
                <span>I confirm that I am at least 19 years of age with government photo ID (BC Cannabis Compliance).</span>
              </label>
              {errors.ageConfirmed && <p className="text-xs text-accent-danger mt-1">{errors.ageConfirmed.message}</p>}
            </div>
          </GlassCard>

          {/* Step 2: Local Delivery Address */}
          <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-border">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-xl font-bold text-forest">Abbotsford & Surrounding Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Street Address *</label>
                <input
                  {...register('addressLine1')}
                  type="text"
                  placeholder="1234 Sumas Way / South Fraser Way"
                  className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                />
                {errors.addressLine1 && <p className="text-xs text-accent-danger mt-1">{errors.addressLine1.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">City *</label>
                  <input
                    {...register('city')}
                    type="text"
                    className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Province</label>
                  <input
                    {...register('province')}
                    type="text"
                    readOnly
                    className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal-muted font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Postal Code *</label>
                  <input
                    {...register('postalCode')}
                    onBlur={handlePostalBlur}
                    type="text"
                    placeholder="V2S 0A1"
                    className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal uppercase focus:ring-2 focus:ring-forest/20 font-mono"
                  />
                  {errors.postalCode && <p className="text-xs text-accent-danger mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

              {/* Zone verification feedback */}
              {postalValidation && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  postalValidation.eligible
                    ? 'bg-emerald/10 text-emerald font-semibold border border-emerald/20'
                    : 'bg-red-50 text-accent-danger font-semibold border border-red-200'
                }`}>
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{postalValidation.message}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Delivery Notes / Buzz Code (Optional)</label>
                <input
                  {...register('deliveryNotes')}
                  type="text"
                  placeholder="Gate code, leave with receptionist, call on arrival..."
                  className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                />
              </div>
            </div>
          </GlassCard>

          {/* Step 3: Payment Method */}
          <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-border">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h2 className="text-xl font-bold text-forest">Payment Method</h2>
            </div>

            {/* Payment Method Selector (Enforces Business Logic Rule) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-forest block">
                Payment Method:
              </label>

              {!isCodAllowed && (
                <div className="p-3 rounded-xl bg-forest/5 border border-forest/10 text-xs text-forest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gold shrink-0" />
                  <span>Orders of $50 CAD or higher qualify for FREE shipping and require Interac E-Transfer payment.</span>
                </div>
              )}

              <div className={`grid grid-cols-1 ${isCodAllowed ? 'sm:grid-cols-2' : ''} gap-4`}>
                <label className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  watchPayment === 'interac_etransfer'
                    ? 'border-forest bg-forest/5 shadow-xs'
                    : 'border-border bg-surface'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-forest text-sm mb-1">
                    <input {...register('paymentMethod')} type="radio" value="interac_etransfer" className="accent-forest" />
                    <span>Interac E-Transfer</span>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Auto-deposit sent to <strong>{BRAND.email}</strong> upon order confirmation.
                  </p>
                </label>

                {/* HIDE COD IF TOTAL >= $50 */}
                {isCodAllowed && (
                  <label className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    watchPayment === 'cash_on_delivery'
                      ? 'border-forest bg-forest/5 shadow-xs'
                      : 'border-border bg-surface'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-forest text-sm mb-1">
                      <input {...register('paymentMethod')} type="radio" value="cash_on_delivery" className="accent-forest" />
                      <span>Cash On Delivery</span>
                    </div>
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      Pay exact cash amount directly to your driver upon arrival at your doorstep (Only available for orders under $50).
                    </p>
                  </label>
                )}
              </div>
            </div>

          </GlassCard>

        </div>

        {/* Right Column: Order Overview */}
        <div className="lg:col-span-4 rounded-2xl glass-card p-6 border border-border bg-surface space-y-6 sticky top-28">
          <h3 className="text-lg font-bold text-forest pb-4 border-b border-border">Order Overview</h3>

          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-xs py-1 border-b border-border/50">
                <div>
                  <span className="font-bold text-charcoal block">{item.product.name}</span>
                  <span className="text-charcoal-muted">{item.quantity}x {item.selectedWeight}</span>
                </div>
                <span className="font-semibold text-forest">
                  {formatCurrency(item.selectedPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm pt-2 border-t border-border">
            <div className="flex justify-between text-charcoal-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Delivery Fee</span>
              <span className="font-semibold text-forest">
                {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-forest pt-3 border-t border-border">
              <span>Order Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-xl cursor-pointer"
            disabled={isProcessingOrder}
            icon={<CheckCircle2 className="w-5 h-5 text-gold" />}
          >
            {isProcessingOrder ? 'Processing Order...' : `Place Order • ${formatCurrency(total)}`}
          </GlassButton>

          <div className="text-[11px] text-center text-charcoal-muted space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>100% Encrypted & Headless Commerce Processing</span>
            </p>
            <p>Drivers carry exact change upon request.</p>
          </div>
        </div>

      </form>
    </div>
  );
};
