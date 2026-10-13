import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, StatusBadge, inputCls } from "@/components/ui-kit";
import { short, useVault, type Asset } from "@/lib/vault";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Portal Verifikasi Publik — Personal AssetVault" }, { name: "description", content: "Cek status sertifikat aset berdasarkan ID sertifikat atau serial number." }, { property: "og:title", content: "Portal Verifikasi Publik" }, { property: "og:description", content: "Cek status sertifikat aset." }] }),
  component: Verify,
});

function Verify() {
  const { assets } = useVault();
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Asset | null | undefined>(undefined);
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const k = q.trim().toLowerCase();
    setRes(assets.find((a) => a.id.toLowerCase() === k || a.serial.toLowerCase() === k) ?? null);
  };
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-center text-3xl font-bold">Portal <span className="text-gradient">Verifikasi Publik</span></h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Masukkan ID sertifikat (mis. AV-7K2M9X) atau serial number. Tanpa perlu wallet.</p>
      <form onSubmit={search} className="mt-6 flex gap-2">
        <input className={`${inputCls} font-mono`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="AV-XXXXXX / Serial" />
        <Btn type="submit">Cek</Btn>
      </form>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">{assets.slice(0, 4).map((a) => <button key={a.id} onClick={() => setQ(a.id)} className="rounded bg-secondary px-2 py-1 font-mono text-muted-foreground hover:text-foreground">{a.id}</button>)}</div>
      {res === null && <Card className="mt-6 border-destructive/40 text-center text-destructive">Sertifikat tidak ditemukan.</Card>}
      {res && (
        <Card className="mt-6">
          <div className="flex items-start justify-between gap-3">
            <div><p className="font-mono text-xs text-muted-foreground">{res.id}</p><h2 className="text-xl font-bold">{res.name}</h2></div>
            <StatusBadge s={res.status} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[["Kategori", res.category], ["Serial", res.serial.slice(0, 4) + "••••"], ["Pemilik saat ini", short(res.owner)], ["Terdaftar", res.history[0].date]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-mono">{v}</dd></div>)}
          </dl>
          <p className={`mt-4 rounded-lg p-3 text-sm ${res.status === "Lost" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
            {res.status === "Lost" ? "⚠ Aset ini dilaporkan hilang. Jangan membeli tanpa konfirmasi pemilik." : "✓ Sertifikat valid (simulasi)."}
          </p>
        </Card>
      )}
    </div>
  );
}
