import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, inputCls } from "@/components/ui-kit";
import { RequireWallet } from "@/components/RequireWallet";
import { currentValue, idr, newCert, useVault, type Category } from "@/lib/vault";

export const Route = createFileRoute("/assets/new")({
  head: () => ({ meta: [{ title: "Tambah Aset — Personal AssetVault" }, { name: "description", content: "Daftarkan aset baru beserta bukti kepemilikan." }, { property: "og:title", content: "Tambah Aset Baru" }, { property: "og:description", content: "Daftarkan aset ke vault." }] }),
  component: () => <RequireWallet><NewAsset /></RequireWallet>,
});

const cats: Category[] = ["Laptop", "Gadget", "Kamera", "Audio", "Lainnya"];

function NewAsset() {
  const { add, wallet } = useVault();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", category: "Laptop" as Category, serial: "", price: "", purchaseDate: new Date().toISOString().slice(0, 10) });
  const [receipt, setReceipt] = useState<string>();
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const valid = f.name.trim() && f.serial.trim() && Number(f.price) > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setTimeout(() => {
      const id = newCert();
      add({ id, name: f.name.trim(), category: f.category, serial: f.serial.trim(), price: Number(f.price), purchaseDate: f.purchaseDate, status: "Active", owner: wallet!.address, receipt, history: [{ date: new Date().toISOString().slice(0, 10), event: "Sertifikat diterbitkan" }] });
      nav({ to: "/assets/$id", params: { id } });
    }, 800);
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <Card>
        <h1 className="text-2xl font-bold">Tambah Aset Baru</h1>
        <p className="mb-6 text-sm text-muted-foreground">Gunakan data dummy. Mint sertifikat hanya simulasi.</p>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm">Nama barang<input className={`${inputCls} mt-1`} value={f.name} onChange={set("name")} placeholder="MacBook Air M2" maxLength={80} /></label>
          <label className="text-sm">Kategori<select className={`${inputCls} mt-1`} value={f.category} onChange={set("category")}>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="text-sm">Serial number<div className="mt-1 flex gap-2"><input className={inputCls} value={f.serial} onChange={set("serial")} maxLength={40} /><Btn type="button" variant="ghost" onClick={() => setF({ ...f, serial: "SN-" + Math.random().toString(36).slice(2, 10).toUpperCase() })}>Acak</Btn></div></label>
          <label className="text-sm">Harga beli (IDR)<input type="number" min={1} className={`${inputCls} mt-1`} value={f.price} onChange={set("price")} placeholder="15000000" /></label>
          <label className="text-sm">Tanggal beli<input type="date" max={new Date().toISOString().slice(0, 10)} className={`${inputCls} mt-1`} value={f.purchaseDate} onChange={set("purchaseDate")} /></label>
          <label className="sm:col-span-2 text-sm">Foto nota (dummy)
            <input type="file" accept="image/*" className={`${inputCls} mt-1 file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-foreground`}
              onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const r = new FileReader(); r.onload = () => setReceipt(r.result as string); r.readAsDataURL(file); }} />
          </label>
          {receipt && <img src={receipt} alt="Nota" className="sm:col-span-2 max-h-48 rounded-lg border border-border object-contain" />}
          <Btn type="submit" disabled={!valid || busy} className="sm:col-span-2">{busy ? "Minting sertifikat (simulasi)..." : "Simpan & Terbitkan Sertifikat"}</Btn>
        </form>
      </Card>
      <Card className="h-fit">
        <p className="text-xs text-muted-foreground">Pratinjau</p>
        <h3 className="mt-1 font-semibold">{f.name || "Nama aset"}</h3>
        <p className="text-xs text-muted-foreground">{f.category} · {f.serial || "—"}</p>
        <div className="mt-4 text-sm">Harga beli: <b>{idr(Number(f.price) || 0)}</b></div>
        <div className="text-sm">Estimasi kini: <b className="text-primary">{idr(currentValue({ price: Number(f.price) || 0, category: f.category, purchaseDate: f.purchaseDate }))}</b></div>
      </Card>
    </div>
  );
}
