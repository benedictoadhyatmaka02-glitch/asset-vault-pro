import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { useVault, short, type Status } from "@/lib/vault";

export function Btn({ variant = "primary", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const v = {
    primary: "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90",
    ghost: "border border-border bg-secondary text-secondary-foreground hover:bg-muted",
    danger: "border border-destructive/40 text-destructive hover:bg-destructive/10",
  }[variant];
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${v} ${className}`} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-xl p-5 ${className}`}>{children}</div>;
}

export function StatusBadge({ s }: { s: Status }) {
  const c = { Active: "bg-success/15 text-success border-success/30", Transferred: "bg-accent/15 text-accent border-accent/30", Lost: "bg-destructive/15 text-destructive border-destructive/30" }[s];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{s}</span>;
}

export function SimBanner() {
  return (
    <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-xs text-warning">
      ⚠ Fitur blockchain masih berupa simulasi antarmuka dan belum melakukan transaksi nyata.
    </div>
  );
}

export function WalletButton() {
  const { wallet, connect, disconnect } = useVault();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  if (wallet)
    return (
      <button onClick={disconnect} title="Disconnect" className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm hover:bg-muted">
        <span className="h-2 w-2 rounded-full bg-success" />
        <span className="font-mono text-primary">{wallet.balance.toFixed(2)} SOL</span>
        <span className="hidden font-mono text-muted-foreground sm:inline">{short(wallet.address)}</span>
      </button>
    );
  return (
    <Btn disabled={loading} onClick={() => { setLoading(true); setTimeout(() => { connect(); setLoading(false); nav({ to: "/dashboard" }); }, 900); }}>
      {loading ? "Menghubungkan..." : "Connect Wallet"}
    </Btn>
  );
}

export function Header() {
  const l = "text-sm text-muted-foreground hover:text-foreground [&.active]:text-primary";
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <SimBanner />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-primary-foreground">◆</span>
          <span className="hidden sm:inline">Personal <span className="text-gradient">AssetVault</span></span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className={l}>Vault</Link>
          <Link to="/assets/new" className={l}>Tambah</Link>
          <Link to="/verify" className={l}>Verifikasi</Link>
        </nav>
        <WalletButton />
      </div>
    </header>
  );
}

export const inputCls = "w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";
