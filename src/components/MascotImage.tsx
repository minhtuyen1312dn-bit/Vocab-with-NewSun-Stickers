import { useState } from 'react';
import { Sun } from 'lucide-react';
import { MASCOT_ASSETS, MascotKey } from '../data/vocabulary';

interface MascotImageProps {
  mascotKey: MascotKey;
  className?: string;
  imgClassName?: string;
}

export function MascotImage({
  mascotKey,
  className = '',
  imgClassName = '',
}: MascotImageProps) {
  const [hasError, setHasError] = useState(false);
  const asset = MASCOT_ASSETS[mascotKey];

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-orange-50 text-orange-700 p-4 rounded-xl border border-orange-200 ${className}`}
      >
        <Sun className="w-12 h-12 mb-2 text-orange-500" aria-hidden="true" />
        <span className="text-sm font-medium text-center">{asset.label}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={asset.src}
        alt={asset.alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`object-contain select-none ${imgClassName}`}
      />
    </div>
  );
}
