import React from 'react';

interface InteracQRCodeProps {
  email: string;
  amount: string;
  reference: string;
  size?: number;
}

export const InteracQRCode: React.FC<InteracQRCodeProps> = ({
  email,
  amount,
  reference,
  size = 140,
}) => {
  // SVG representation of Interac QR code pattern with branding accent
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-border shadow-xs">
      <div className="relative p-2 bg-white rounded-xl">
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          {/* Background */}
          <rect width="100" height="100" rx="6" fill="white" />
          
          {/* Top-Left Finder Pattern */}
          <rect x="10" y="10" width="24" height="24" rx="4" fill="#1D4D3A" />
          <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
          <rect x="18" y="18" width="8" height="8" rx="1" fill="#C8A65A" />

          {/* Top-Right Finder Pattern */}
          <rect x="66" y="10" width="24" height="24" rx="4" fill="#1D4D3A" />
          <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
          <rect x="74" y="18" width="8" height="8" rx="1" fill="#C8A65A" />

          {/* Bottom-Left Finder Pattern */}
          <rect x="10" y="66" width="24" height="24" rx="4" fill="#1D4D3A" />
          <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
          <rect x="18" y="74" width="8" height="8" rx="1" fill="#C8A65A" />

          {/* Decorative Data Matrix Blocks */}
          <rect x="40" y="12" width="6" height="6" rx="1" fill="#1D4D3A" />
          <rect x="52" y="12" width="8" height="6" rx="1" fill="#1D4D3A" />
          <rect x="42" y="24" width="14" height="6" rx="1" fill="#C8A65A" />
          <rect x="12" y="42" width="8" height="6" rx="1" fill="#1D4D3A" />
          <rect x="24" y="42" width="6" height="6" rx="1" fill="#1D4D3A" />
          <rect x="36" y="38" width="8" height="12" rx="1" fill="#1D4D3A" />
          <rect x="48" y="44" width="12" height="6" rx="1" fill="#C8A65A" />
          <rect x="64" y="40" width="8" height="8" rx="1" fill="#1D4D3A" />
          <rect x="76" y="42" width="12" height="6" rx="1" fill="#1D4D3A" />
          <rect x="42" y="60" width="14" height="8" rx="1" fill="#1D4D3A" />
          <rect x="60" y="60" width="8" height="6" rx="1" fill="#C8A65A" />
          <rect x="72" y="64" width="16" height="6" rx="1" fill="#1D4D3A" />
          <rect x="40" y="74" width="12" height="12" rx="1" fill="#1D4D3A" />
          <rect x="56" y="76" width="10" height="10" rx="1" fill="#1D4D3A" />
          <rect x="70" y="78" width="18" height="8" rx="1" fill="#C8A65A" />

          {/* Center Brand Badge Icon */}
          <circle cx="50" cy="50" r="11" fill="white" stroke="#1D4D3A" strokeWidth="2" />
          <path d="M46 50L49 53L54 47" stroke="#C8A65A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="text-center pt-1.5 space-y-0.5">
        <span className="text-[10px] font-bold text-forest uppercase tracking-wider block">Scan with Banking App</span>
        <span className="text-[9px] text-charcoal-muted block font-mono">{email}</span>
      </div>
    </div>
  );
};
