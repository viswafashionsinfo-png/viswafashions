'use client';

import { useState } from 'react';

interface HeroImageProps {
  src: string | null;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  const [failed, setFailed] = useState(false);
  const trimmed = src?.trim() ?? '';
  const showImage = trimmed.length > 0 && !failed;

  if (!showImage) {
    return (
      <div
        className="w-full h-full bg-neutral-100 flex items-center justify-center"
        role="img"
        aria-label={alt}
      >
        <span className="text-neutral-400 text-sm">No image</span>
      </div>
    );
  }

  return (
    <img
      src={trimmed}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
