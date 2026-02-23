# Kalkulator Pajak Properti - Indonesia

Web app sederhana untuk menghitung estimasi pajak properti (PPh Penjual, PPN, BPHTB) sesuai UU HPP & PMK 2024-2025.

Fitur utama:
- Form input 8 field (jenis properti, harga, NJOP, NPOP, NPOPTKP, status penjual/pembeli, tanggal)
- Perhitungan PPh, PPN (termasuk insentif DTP), BPHTB
- Riwayat perhitungan (localStorage, 10 terakhir)
- Salin hasil, unduh PDF (opsional), penjelasan pasal (tooltip)
- Mode dark watercolor, responsive mobile

Instalasi:

1. Pasang dependensi

```bash
npm install
```

2. Jalankan pengembangan

```bash
npm run dev
```

Catatan:
- File konfigurasi Tailwind sudah ada. Untuk PDF fitur opsional menggunakan `html2pdf.js`.
- Atur `PPN_CUTOFF_DATE` di `.env` bila ingin menyesuaikan tanggal efektif tarif PPN 12%.
# web-kalkulator-pajak-properti