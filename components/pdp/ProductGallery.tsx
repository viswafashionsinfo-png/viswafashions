'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const hasMany = images.length > 1;
  const current = images[active];

  // Scroll only the thumbnail strip (never the page) to keep the active one visible.
  useEffect(() => {
    const list = listRef.current;
    const thumb = thumbRefs.current[active];
    if (!list || !thumb) return;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: thumb.offsetLeft - (list.clientWidth - thumb.clientWidth) / 2, behavior: 'smooth' });
    } else if (list.scrollHeight > list.clientHeight) {
      list.scrollTo({ top: thumb.offsetTop - (list.clientHeight - thumb.clientHeight) / 2, behavior: 'smooth' });
    }
  }, [active]);

  function go(delta: number) {
    if (!hasMany) return;
    setActive((i) => (i + delta + images.length) % images.length);
  }

  function markFailed(url: string) {
    setFailed((prev) => new Set(prev).add(url));
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  }

  const arrowClass =
    'hidden lg:flex w-7 h-7 shrink-0 rounded-full border border-neutral-300 items-center justify-center text-neutral-600 hover:border-brand-maroon hover:text-brand-maroon transition-colors';

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-3 lg:gap-4">
      <div
        className="relative flex-1 aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden bg-neutral-100 shadow-card"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        {current && !failed.has(current) ? (
          <img
            key={current}
            src={current}
            alt={alt}
            className="w-full h-full object-cover object-top animate-fade-in"
            onError={() => markFailed(current)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" role="img" aria-label={alt}>
            <span className="font-serif text-lg text-neutral-400">Image coming soon</span>
          </div>
        )}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="lg:hidden absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-neutral-700"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-neutral-700"
            >
              <ChevronRight size={18} />
            </button>
            <span className="lg:hidden absolute bottom-3 right-3 bg-neutral-900/70 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="flex lg:flex-col items-center gap-3 lg:w-20 lg:shrink-0">
          <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={arrowClass}>
            <ChevronUp size={14} />
          </button>
          <div
            ref={listRef}
            className="relative flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[30rem] no-scrollbar p-1 w-full lg:w-auto"
          >
            {images.map((url, i) => (
              <button
                key={url}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === active}
                className={`shrink-0 w-16 h-20 lg:w-20 lg:h-24 rounded-lg overflow-hidden bg-neutral-100 transition-all ${
                  i === active
                    ? 'ring-2 ring-brand-maroon ring-offset-2 ring-offset-brand-bg'
                    : 'ring-1 ring-neutral-200 opacity-80 hover:opacity-100'
                }`}
              >
                {failed.has(url) ? (
                  <span className="block w-full h-full bg-neutral-100" />
                ) : (
                  <img src={url} alt="" className="w-full h-full object-cover" onError={() => markFailed(url)} />
                )}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next image" className={arrowClass}>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
