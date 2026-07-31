import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

export const ShareLink: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <button onClick={handleCopy} className={`btn-secondary justify-center ${className}`}>
      <Icon name={copied ? 'check' : 'share'} size={20} />
      {copied ? 'Gekopieerd!' : 'Deel link'}
    </button>
  );
};
