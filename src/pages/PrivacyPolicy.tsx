import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-charcoal">
      <h1 className="text-3xl font-bold text-forest border-b border-border pb-4">Privacy Policy</h1>
      <div className="prose text-sm text-charcoal-muted leading-relaxed space-y-4 font-light">
        <p>
          At EliteBud ("we", "our", "us"), we prioritize the privacy and security of our Abbotsford and BC customers. This Privacy Policy outlines how your personal information is collected, used, and protected during order fulfillment and website interaction.
        </p>
        <h3 className="text-base font-bold text-forest pt-2">1. Information We Collect</h3>
        <p>
          When you place an order or contact dispatch, we collect essential details required for same-day local delivery, including your name, contact phone number, delivery street address, email address, and age verification confirmation.
        </p>
        <h3 className="text-base font-bold text-forest pt-2">2. How Information is Used</h3>
        <p>
          Your information is strictly utilized to dispatch local delivery drivers, send SMS/email order tracking updates, process Interac E-Transfer payments, and enforce BC provincial 19+ legal age compliance. We never sell, rent, or trade customer data to third-party advertisers.
        </p>
        <h3 className="text-base font-bold text-forest pt-2">3. Data Security</h3>
        <p>
          Our application architecture uses encrypted headless commerce APIs. Sensitive payment information is processed securely through bank-level Interac E-Transfer protocols or exact cash on delivery.
        </p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-charcoal">
      <h1 className="text-3xl font-bold text-forest border-b border-border pb-4">Terms of Service</h1>
      <div className="prose text-sm text-charcoal-muted leading-relaxed space-y-4 font-light">
        <p>
          Welcome to EliteBud. By accessing or using our headless ecommerce application, you agree to be bound by these Terms of Service and all applicable laws and regulations in British Columbia, Canada.
        </p>
        <h3 className="text-base font-bold text-forest pt-2">1. Age Requirement (19+ BC Law)</h3>
        <p>
          You must be at least 19 years of age to purchase cannabis products in British Columbia. Government-issued photo identification matching the order customer name must be presented to your delivery driver upon arrival.
        </p>
        <h3 className="text-base font-bold text-forest pt-2">2. Same-Day Delivery & Dispatch</h3>
        <p>
          Same-day delivery estimated times (1–3 hours) are provided as targets under normal traffic and weather conditions across Abbotsford, Mission, Chilliwack, Aldergrove, and Langley Township.
        </p>
        <h3 className="text-base font-bold text-forest pt-2">3. Payments</h3>
        <p>
          Accepted payment methods are Interac E-Transfer (auto-deposit to safepayabby@gmail.com) and Cash On Delivery. Orders paid via E-Transfer are processed for dispatch upon payment receipt.
        </p>
      </div>
    </div>
  );
};
