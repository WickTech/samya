"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  lineKey,
  orderCount,
  orderTotal,
  resolveLines,
  type OrderLine,
  type ResolvedLine,
} from "@/lib/order";

const STORAGE_KEY = "samya.order.v1";

interface OrderContextValue {
  lines: OrderLine[];
  resolved: ResolvedLine[];
  count: number;
  total: number;
  /** Panel open state (shared so any button can open it). */
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (itemId: string, grams?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  isHydrated: boolean;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate from localStorage after mount. Done in an effect (not a lazy
  // initializer) so server and first client render agree, avoiding a
  // hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrderLine[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore corrupt / unavailable storage */
    }
    setIsHydrated(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be full or blocked */
    }
  }, [lines, isHydrated]);

  const add = useCallback((itemId: string, grams?: number) => {
    setLines((prev) => {
      const key = lineKey(itemId, grams);
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { key, itemId, grams, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const resolved = useMemo(() => resolveLines(lines), [lines]);

  const value = useMemo<OrderContextValue>(
    () => ({
      lines,
      resolved,
      count: orderCount(lines),
      total: orderTotal(resolved),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
      clear,
      isHydrated,
    }),
    [lines, resolved, isOpen, add, setQty, remove, clear, isHydrated],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within <OrderProvider>");
  return ctx;
}
