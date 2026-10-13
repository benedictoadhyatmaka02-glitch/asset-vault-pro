# Personal AssetVault (Solana Devnet Simulation)

Prototipe dApp brankas digital untuk pencatatan bukti kepemilikan gawai personal dan pemantauan depresiasi nilai aset berbasis simulasi Solana Devnet.

Proyek ini disusun untuk memenuhi tugas **Modul 2: Build dengan AI Agent** pada mata kuliah **Praktikum Keamanan Data dan Blockchain**, Program Studi S1-Teknik Informatika, Universitas Semarang.

---

## Identitas Pengembang
- **Nama:** Benedicto Adhyatmaka
- **NIM:** G.231.24.0043
- **Program Studi:** S1-Teknik Informatika
- **Institusi:** FTIK, Universitas Semarang

---

## Problem Statement
Untuk pemilik barang berharga personal yang mengalami risiko kehilangan nota fisik dan ketiadaan bukti tanggal kepemilikan yang sah, kami membangun Personal AssetVault agar mereka dapat mengarsipkan bukti kepemilikan dan memantau estimasi nilai susut secara transparan. Berbeda dari pencatatan spreadsheet biasa, sistem ini mengikat integritas bukti dan stempel waktu kepemilikan berbasis simulasi Solana Devnet tanpa mengekspos data pribadi ke publik.

---

## 5 Fitur Utama (MVP)
1. **Simulasi Connect Wallet:** Tampilan status koneksi dompet Solana Devnet dummy beserta saldo SOL uji coba.
2. **Form Tambah Aset & Bukti Dummy:** Input data gawai, nomor seri, harga beli, dan unggah sampel nota dummy.
3. **Dashboard Valuasi & Depresiasi:** Pemantauan portofolio aset dengan perhitungan susut nilai otomatis berbasis durasi perolehan.
4. **Simulasi Transfer Kepemilikan:** Alur pengalihan hak milik aset ke alamat wallet penerima.
5. **Portal Verifikasi Publik:** Mesin pencari nomor seri atau ID sertifikat aset untuk memeriksa keabsahan tanpa perlu menghubungkan dompet.

---

## Catatan Simulasi & Keamanan (Penting)
- **Simulasi Antarmuka:** Seluruh fitur blockchain pada tahap Modul 2 ini masih berupa simulasi antarmuka front-end dan belum mengeksekusi smart contract atau RPC on-chain riil.
- **Data Sintetis:** Seluruh nomor seri, gambar kuitansi, dan nilai transaksi yang digunakan adalah data dummy.
- **Nol Kunci Privat:** Sistem tidak pernah meminta, menerima, atau menyimpan Private Key atau Seed Phrase pengguna.

---

## Teknologi yang Digunakan
- **Framework:** React & TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Platform AI:** Lovable.dev

---

## Panduan Instalasi Lokal
1. Kloning repositori:
   git clone https://github.com/[username-anda]/personal-assetvault.git
2. Masuk ke direktori:
   cd personal-assetvault
3. Pasang dependensi:
   npm install
4. Jalankan aplikasi:
   npm run dev
5. Buka `http://localhost:8080` atau port yang tertera pada terminal.
