import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, StatusBadge, inputCls } from "@/components/ui-kit";
import { RequireWallet } from "@/components/RequireWallet";
import { currentValue, idr, short, useVault, type Status } from "@/lib/vault";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard Vault — Personal AssetVault" }, { name: "description", content: "Daftar koleksi aset dan total valuasi vault Anda." }, { property: "og:title", content: "Dashboard Vault" }, { property: "og:description", content: "Koleksi aset & total valuasi." }] }),
  component: () => <RequireWallet><Dashboard /></RequireWallet>,
});

function Dashboard() {
  const { assets, wallet } = useVault();
  const [f, setF] = useState<Status | "All">("All");
  const [q, setQ] = useState("");
  const mine = assets.filter((a) => a.owner === wallet!.address || a.status === "Transferred");
  const owned = mine.filter((a) => a.status !== "Transferred");
  const totalBuy = owned.reduce((s, a) => s + a.price, 0);
  const totalNow = owned.reduce((s, a) => s + currentValue(a), 0);
  const list = mine.filter((a) => (f === "All" || a.status === f) && a.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-xs text-muted-foreground">Vault · {short(wallet!.address)}</p><h1 className="text-3xl font-bold">Vault Pribadi</h1></div>
        <Link to="/assets/new" className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">+ Tambah Aset</Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><p className="text-xs text-muted-foreground">Estimasi Valuasi</p><p className="mt-1 text-2xl font-bold text-gradient">{idr(totalNow)}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Total Harga Beli</p><p className="mt-1 text-2xl font-bold">{idr(totalBuy)}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Total Susut</p><p className="mt-1 text-2xl font-bold text-destructive">-{idr(totalBuy - totalNow)}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Aset</p><p className="mt-1 text-2xl font-bold">{owned.length} <span className="text-sm font-normal text-muted-foreground">dimiliki / {mine.length} total</span></p></Card>
      </div>
      <Card className="mt-6 p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          {(["All", "Active", "Transferred", "Lost"] as const).map((s) => (
            <button key={s} onClick={() => setF(s)} className={`rounded-full px-3 py-1 text-xs ${f === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s}</button>
          ))}
          <input placeholder="Cari aset..." value={q} onChange={(e) => setQ(e.target.value)} className={`${inputCls} ml-auto max-w-xs`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground"><tr className="border-b border-border">
              <th className="p-4">Aset</th><th className="hidden p-4 md:table-cell">Sertifikat</th><th className="hidden p-4 sm:table-cell">Harga Beli</th><th className="p-4">Nilai Kini</th><th className="p-4">Status</th>
            </tr></thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                  <td className="p-4"><Link to="/assets/$id" params={{ id: a.id }} className="font-medium hover:text-primary">{a.name}</Link><div className="text-xs text-muted-foreground">{a.category}</div></td>
                  <td className="hidden p-4 font-mono text-xs md:table-cell">{a.id}</td>
                  <td className="hidden p-4 sm:table-cell">{idr(a.price)}</td>
                  <td className="p-4 font-medium">{idr(currentValue(a))}</td>
                  <td className="p-4"><StatusBadge s={a.status} /></td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Tidak ada aset.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
