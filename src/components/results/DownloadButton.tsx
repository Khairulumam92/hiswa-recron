import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

interface DownloadButtonProps {
  elementId?: string;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ elementId = 'result-card', className = '' }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <button
      onClick={handleDownload}
      className={`btn-primary justify-center ${className}`}
    >
      <Icon name={downloaded ? 'check' : 'download'} size={20} />
      {downloaded ? 'Link gekopieerd!' : 'Download resultaat'}
    </button>
  );
};
