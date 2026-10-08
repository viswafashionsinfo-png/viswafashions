'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clampQuantity } from '@/lib/pricing';

// Guest bag + wishlist, kept in this browser's localStorage only (the store
// has no customer accounts). Only product ids and quantities are stored;
// names and prices are always re-read from Supabase when displayed.

export interface BagItem {
  productId: string;
  quantity: number;
}

interface GuestStore {
  ready: boolean;
  bag: BagItem[];
  bagCount: number;
  addToBag: (productId: string, quantity: number) => void;
  setBagQuantity: (productId: string, quantity: number) => void;
  removeFromBag: (productId: string) => void;
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
}

const BAG_KEY = 'vf_bag';
const WISHLIST_KEY = 'vf_wishlist';

const GuestStoreContext = createContext<GuestStore | null>(null);

function readList<T>(key: string, isValid: (item: unknown) => item is T): T[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch {
    return [];
  }
}

function isBagItem(item: unknown): item is BagItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as BagItem).productId === 'string' &&
    typeof (item as BagItem).quantity === 'number'
  );
}

function isString(item: unknown): item is string {
  return typeof item === 'string';
}

export default function GuestStoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    function load() {
      setBag(readList(BAG_KEY, isBagItem).map((i) => ({ ...i, quantity: clampQuantity(i.quantity) })));
      setWishlist(readList(WISHLIST_KEY, isString));
    }
    load();
    setReady(true);

    function handleStorage(e: StorageEvent) {
      if (e.key === BAG_KEY || e.key === WISHLIST_KEY) load();
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  }, [bag, ready]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToBag = useCallback((productId: string, quantity: number) => {
    setBag((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i
        );
      }
      return [...prev, { productId, quantity: clampQuantity(quantity) }];
    });
  }, []);

  const setBagQuantity = useCallback((productId: string, quantity: number) => {
    setBag((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: clampQuantity(quantity) } : i))
    );
  }, []);

  const removeFromBag = useCallback((productId: string) => {
    setBag((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const value = useMemo<GuestStore>(
    () => ({
      ready,
      bag,
      bagCount: bag.reduce((sum, i) => sum + i.quantity, 0),
      addToBag,
      setBagQuantity,
      removeFromBag,
      wishlist,
      isWishlisted: (productId: string) => wishlist.includes(productId),
      toggleWishlist,
    }),
    [ready, bag, wishlist, addToBag, setBagQuantity, removeFromBag, toggleWishlist]
  );

  return <GuestStoreContext.Provider value={value}>{children}</GuestStoreContext.Provider>;
}

export function useGuestStore(): GuestStore {
  const store = useContext(GuestStoreContext);
  if (!store) throw new Error('useGuestStore must be used inside GuestStoreProvider');
  return store;
}
