import React, { useState } from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://hiswa-recron.nl';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&color=003E6F&bgcolor=FFFFFF`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#dde1e9]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#003e6f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F47D00]">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white leading-tight">
                Scan & Speel QR-Code
              </h3>
              <p className="text-white/80 text-xs mt-0.5">
                Beursstand & Mobiele Toegang
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          
          <p className="text-xs text-[#5e6e85] leading-relaxed mb-5 max-w-xs">
            Scan deze QR-code met je smartphone camera om direct het Jong RECRON Career Discovery spel te starten op de beursstand.
          </p>

          {/* QR Code Container */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#003e6f]/20 shadow-xl mb-5 flex flex-col items-center">
            <img
              src={qrApiUrl}
              alt="Jong RECRON QR Code"
              className="w-48 h-48 object-contain rounded-lg"
              loading="eager"
            />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-heading font-bold text-[#003e6f]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Directe Spellink Actief
            </div>
          </div>

          {/* URL Box & Copy */}
          <div className="w-full p-3 rounded-xl bg-[#f0f4fb] border border-[#dde1e9] flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono text-[#003e6f] truncate flex-1 text-left px-1">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="btn-primary py-1.5 px-3 text-xs shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Gekopieerd!' : 'Kopieer'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f8fafc] border-t border-[#dde1e9] flex items-center justify-between text-xs text-[#5e6e85]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#003e6f]">verified</span>
            HISWA-RECRON Beursstand Kiosk
          </span>
          <button
            onClick={onClose}
            className="font-heading font-bold text-[#003e6f] hover:underline"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};
