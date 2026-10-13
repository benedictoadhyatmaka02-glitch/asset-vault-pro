import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Status = "Active" | "Transferred" | "Lost";
export type Category = "Laptop" | "Gadget" | "Kamera" | "Audio" | "Lainnya";
export interface Asset {
  id: string; // certificate id
  name: string;
  category: Category;
  serial: string;
  price: number;
  purchaseDate: string;
  status: Status;
  owner: string;
  receipt?: string | undefined;
  history: { date: string; event: string; to?: string }[];
}

export const RATES: Record<Category, number> = { Laptop: 0.25, Gadget: 0.3, Kamera: 0.15, Audio: 0.2, Lainnya: 0.2 };
export const FLOOR = 0.1;

export function monthsOwned(date: string, at = new Date()) {
  const d = new Date(date);
  return Math.max(0, (at.getFullYear() - d.getFullYear()) * 12 + at.getMonth() - d.getMonth());
}
export function currentValue(a: Pick<Asset, "price" | "category" | "purchaseDate">, at = new Date()) {
  const years = monthsOwned(a.purchaseDate, at) / 12;
  return Math.max(a.price * FLOOR, a.price * Math.pow(1 - RATES[a.category], years));
}
export const idr = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
export const short = (a: string) => `${a.slice(0, 3)}...${a.slice(-2)}`;

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const randAddr = () => Array.from({ length: 44 }, () => B58[Math.floor(Math.random() * 58)]).join("");
export const isAddr = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s);
export const newCert = () => "AV-" + Math.random().toString(36).slice(2, 8).toUpperCase();

const OWNER = "7XwQm4bKpR2nFhT8vLz3cYeJ5uA6sD1gN9oPq";
const seed: Asset[] = [
  { id: "AV-7K2M9X", name: "MacBook Pro 14\" M3", category: "Laptop", serial: "C02XK9DUMMY", price: 32000000, purchaseDate: "2024-03-10", status: "Active", owner: OWNER, history: [{ date: "2024-03-10", event: "Sertifikat diterbitkan" }] },
  { id: "AV-3PQ8LZ", name: "Sony A7 IV", category: "Kamera", serial: "SNY-44821-DM", price: 38500000, purchaseDate: "2023-08-22", status: "Active", owner: OWNER, history: [{ date: "2023-08-22", event: "Sertifikat diterbitkan" }] },
  { id: "AV-9TR4BN", name: "iPhone 15 Pro", category: "Gadget", serial: "F17ZQ-DUMMY-01", price: 19999000, purchaseDate: "2024-10-01", status: "Active", owner: OWNER, history: [{ date: "2024-10-01", event: "Sertifikat diterbitkan" }] },
  { id: "AV-2WE6YH", name: "iPad Air M2", category: "Gadget", serial: "DMPX-77231", price: 11500000, purchaseDate: "2022-05-15", status: "Transferred", owner: "9bTfL2xKqM8vRz4nPwYc6HdJ3sA5eU1gQ7oZm", history: [{ date: "2022-05-15", event: "Sertifikat diterbitkan" }, { date: "2025-01-12", event: "Ditransfer", to: "9bTfL2xKqM8vRz4nPwYc6HdJ3sA5eU1gQ7oZm" }] },
  { id: "AV-5JD1CV", name: "Sony WH-1000XM5", category: "Audio", serial: "WH5-DUMMY-889", price: 5499000, purchaseDate: "2023-01-20", status: "Lost", owner: OWNER, history: [{ date: "2023-01-20", event: "Sertifikat diterbitkan" }, { date: "2025-06-02", event: "Dilaporkan hilang" }] },
];

interface Ctx {
  wallet: { address: string; balance: number } | null;
  connect: () => void; disconnect: () => void;
  assets: Asset[];
  add: (a: Asset) => void;
  update: (id: string, fn: (a: Asset) => Asset) => void;
}
const VaultCtx = createContext<Ctx | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Ctx["wallet"]>(null);
  const [assets, setAssets] = useState<Asset[]>(seed);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem("av-state");
      if (s) { const p = JSON.parse(s); setAssets(p.assets); setWallet(p.wallet); }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem("av-state", JSON.stringify({ assets, wallet })); }, [assets, wallet, loaded]);
  return (
    <VaultCtx.Provider value={{
      wallet,
      connect: () => setWallet({ address: OWNER, balance: 12.4837 }),
      disconnect: () => setWallet(null),
      assets,
      add: (a) => setAssets((x) => [a, ...x]),
      update: (id, fn) => setAssets((x) => x.map((a) => (a.id === id ? fn(a) : a))),
    }}>{children}</VaultCtx.Provider>
  );
}
export const useVault = () => useContext(VaultCtx)!;
