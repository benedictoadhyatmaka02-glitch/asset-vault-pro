# Asset Vault Pro

Buat website responsive bernama Personal AssetVault.

Tujuan:

Membantu pemilik mengelola brankas barang berharga pribadi (laptop, gadget, kamera), mencatat bukti kepemilikan, dan memantau estimasi nilai susut barang.

Target Pengguna:

1. Vault Owner (Pemilik)

2. Recipient (Penerima transfer)

3. Public Verifier (Pemeriksa publik)

Halaman:

- Landing Page dengan tombol simulasi Connect Wallet.

- Dashboard Vault Pribadi (daftar koleksi aset dan total valuasi).

- Form Tambah Aset Baru.

- Detail Aset dan simulasi depresiasi.

- Portal Verifikasi Publik.

Fitur:

- Simulasi Connect Wallet Solana (menampilkan dummy balance SOL dan short address, misal: 7Xw...9Pq).

- Form tambah aset dummy (nama barang, kategori, serial number dummy, harga beli, upload foto nota dummy).

- Kalkulasi depresiasi otomatis berbasis durasi kepemilikan.

- Simulasi transfer aset ke alamat wallet penerima.

- Pencarian status sertifikat aset pada portal publik.

UI & Batasan:

- Desain dark-mode modern Web3, profesional, responsive desktop dan mobile.

- Gunakan card, badge status (Active, Transferred, Lost), dan tabel ringkas.

- Gunakan data dummy/sintetis.

- Jangan meminta private key atau seed phrase.

- Tambahkan label/banner: "Fitur blockchain masih berupa simulasi antarmuka dan belum melakukan transaksi nyata."

- Gunakan React dan TypeScript. Jangan buat smart contract sungguhan.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4adbde01-6d02-4953-931c-2440ccb50bbc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
