import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, WalletButton } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal AssetVault — Brankas Aset Pribadi Web3" },
      { name: "description", content: "Kelola barang berharga, bukti kepemilikan, dan estimasi depresiasi dalam satu vault." },
      { property: "og:title", content: "Personal AssetVault" },
      { property: "og:description", content: "Brankas digital untuk laptop, gadget, dan kamera Anda." },
    ],
  }),
  component: Landing,
});

const features = [
  ["Bukti Kepemilikan", "Sertifikat digital untuk setiap aset lengkap dengan serial & nota."],
  ["Depresiasi Otomatis", "Estimasi nilai susut dihitung dari durasi kepemilikan."],
  ["Transfer Aset", "Pindahkan kepemilikan ke wallet penerima dalam sekali klik."],
  ["Verifikasi Publik", "Siapa pun dapat memeriksa status sertifikat aset."],
];

function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">Solana · Devnet Simulation</span>
        <h1 className="mt-6 text-4xl font-bold md:text-6xl">Brankas pribadi untuk <span className="text-gradient">barang berharga</span> Anda</h1>
        <p className="mt-5 text-muted-foreground md:text-lg">Catat laptop, gadget, dan kamera. Simpan bukti kepemilikan, pantau nilai susut, dan transfer ke pemilik baru.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <WalletButton />
          <Link to="/verify" className="inline-flex items-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-muted">Verifikasi Sertifikat</Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">🔒 Kami tidak akan pernah meminta private key atau seed phrase.</p>
      </div>
      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([t, d], i) => (
          <Card key={t}>
            <div className="font-mono text-xs text-primary">0{i + 1}</div>
            <h3 className="mt-2 font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {([["Vault Owner", "Mendaftarkan & mengelola aset."], ["Recipient", "Menerima transfer kepemilikan."], ["Public Verifier", "Memeriksa keaslian sertifikat."]] as const).map(([t, d]) => (
          <Card key={t} className="flex items-center gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand font-bold text-primary-foreground">{t.charAt(0)}</div>
            <div><div className="font-semibold">{t}</div><div className="text-sm text-muted-foreground">{d}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
