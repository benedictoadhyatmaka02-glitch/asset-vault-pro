import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Card, StatusBadge, inputCls } from "@/components/ui-kit";
import { RequireWallet } from "@/components/RequireWallet";
import { FLOOR, RATES, currentValue, idr, isAddr, monthsOwned, randAddr, short, useVault } from "@/lib/vault";

export const Route = createFileRoute("/assets/$id")({
  head: () => ({ meta: [{ title: "Detail Aset — Personal AssetVault" }, { name: "description", content: "Detail aset, simulasi depresiasi, dan transfer kepemilikan." }, { property: "og:title", content: "Detail Aset" }, { property: "og:description", content: "Detail & simulasi depresiasi aset." }] }),
  component: () => <RequireWallet><Detail /></RequireWallet>,
});

function Detail() {
  const { id } = Route.useParams();
  const { assets, update, wallet } = useVault();
  const a = assets.find((x) => x.id === id);
  const [years, setYears] = useState(3);
  const [to, setTo] = useState("");
  const [step, setStep] = useState<"idle" | "confirm" | "sending" | "done">("idle");
  const [tx, setTx] = useState("");

  if (!a) return <div className="p-16 text-center">Aset tidak ditemukan. <Link to="/dashboard" className="text-primary">Kembali</Link></div>;
  const isOwner = a.owner === wallet!.address && a.status === "Active";
  const now = currentValue(a);
  const m = monthsOwned(a.purchaseDate);
  const rows = Array.from({ length: years + 1 }, (_, y) => {
    const d = new Date(a.purchaseDate); d.setFullYear(d.getFullYear() + y);
    return { y, v: currentValue(a, d) };
  });
  const today = new Date().toISOString().slice(0, 10);

  const send = () => {
    setStep("sending");
    setTimeout(() => {
      const sig = randAddr() + randAddr().slice(0, 20);
      setTx(sig);
      update(a.id, (x) => ({ ...x, status: "Transferred", owner: to, history: [...x.history, { date: today, event: "Ditransfer", to }] }));
      setStep("done");
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Vault</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold">{a.name}</h1><StatusBadge s={a.status} /></div>
      <p className="font-mono text-xs text-muted-foreground">Sertifikat {a.id}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Simulasi Depresiasi</h2>
          <p className="text-xs text-muted-foreground">Saldo menurun {(RATES[a.category] * 100).toFixed(0)}%/tahun untuk {a.category}, nilai minimum {FLOOR * 100}% harga beli.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground">Harga beli</p><p className="font-bold">{idr(a.price)}</p></div>
            <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground">Nilai kini ({m} bln)</p><p className="font-bold text-primary">{idr(now)}</p></div>
            <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground">Susut</p><p className="font-bold text-destructive">-{((1 - now / a.price) * 100).toFixed(1)}%</p></div>
          </div>
          <label className="mt-5 block text-sm">Proyeksi {years} tahun<input type="range" min={1} max={10} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-[var(--primary)]" /></label>
          <div className="mt-3 flex h-32 items-end gap-1">
            {rows.map((r) => <div key={r.y} title={idr(r.v)} className="flex-1 rounded-t bg-gradient-brand opacity-80" style={{ height: `${(r.v / a.price) * 100}%` }} />)}
          </div>
          <table className="mt-4 w-full text-sm"><tbody>
            {rows.map((r) => <tr key={r.y} className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Tahun {r.y}</td><td className="py-1.5 text-right font-mono">{idr(r.v)}</td></tr>)}
          </tbody></table>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold">Info Aset</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {[["Kategori", a.category], ["Serial", a.serial], ["Tgl beli", a.purchaseDate], ["Pemilik", short(a.owner)]].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono">{v}</dd></div>)}
            </dl>
            {a.receipt ? <img src={a.receipt} alt="Nota" className="mt-3 max-h-40 w-full rounded border border-border object-contain" /> : <p className="mt-3 rounded border border-dashed border-border p-3 text-center text-xs text-muted-foreground">Nota dummy tidak diunggah</p>}
            {isOwner && <Btn variant="danger" className="mt-4 w-full" onClick={() => update(a.id, (x) => ({ ...x, status: "Lost", history: [...x.history, { date: today, event: "Dilaporkan hilang" }] }))}>Laporkan Hilang</Btn>}
          </Card>

          <Card>
            <h2 className="font-semibold">Transfer Aset</h2>
            {step === "done" ? (
              <div className="mt-3 text-sm"><p className="text-success">✓ Transfer simulasi berhasil</p><p className="mt-2 break-all font-mono text-xs text-muted-foreground">Tx: {tx}</p></div>
            ) : !isOwner ? (
              <p className="mt-2 text-sm text-muted-foreground">Hanya aset berstatus Active milik Anda yang bisa ditransfer.</p>
            ) : (
              <div className="mt-3 space-y-3">
                <input className={`${inputCls} font-mono`} placeholder="Alamat wallet penerima" value={to} onChange={(e) => { setTo(e.target.value.trim()); setStep("idle"); }} />
                <button className="text-xs text-primary" onClick={() => setTo(randAddr())}>Isi alamat dummy</button>
                {to && !isAddr(to) && <p className="text-xs text-destructive">Format alamat Solana tidak valid.</p>}
                {step === "idle" && <Btn className="w-full" disabled={!isAddr(to) || to === wallet!.address} onClick={() => setStep("confirm")}>Transfer</Btn>}
                {step !== "idle" && (
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
                    Transfer {a.name} ke <span className="font-mono">{short(to)}</span>? Biaya jaringan simulasi: 0.000005 SOL.
                    <div className="mt-3 flex gap-2"><Btn variant="ghost" onClick={() => setStep("idle")}>Batal</Btn><Btn disabled={step === "sending"} onClick={send}>{step === "sending" ? "Mengirim..." : "Konfirmasi"}</Btn></div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-semibold">Riwayat</h2>
            <ol className="mt-3 space-y-2 border-l border-border pl-4 text-sm">
              {a.history.map((h, i) => <li key={i}><span className="text-xs text-muted-foreground">{h.date}</span><div>{h.event}{h.to && <span className="font-mono text-xs"> → {short(h.to)}</span>}</div></li>)}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
