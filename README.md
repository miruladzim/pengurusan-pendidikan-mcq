# HPGD2203 — Sistem Peperiksaan Mock MCQ

Sistem peperiksaan mock berbilang pilihan untuk kursus **Pengurusan Pendidikan** (HPGD2203), Open University Malaysia. Soalan dijana berdasarkan modul kursus.

## Ciri-ciri

- **5 set peperiksaan mock** — 40 soalan MCQ setiap set (200 soalan unik)
- **Mod Peperiksaan** — 60 minit, tanpa maklum balas semasa ujian, auto-hantar apabila masa tamat
- **Mod Latihan** — maklum balas segera dengan penjelasan selepas setiap jawapan
- **Acak** — susunan soalan dan pilihan jawapan diacak setiap percubaan
- **Keputusan** — markah, lulus/gagal (60%), semakan jawapan terperinci
- **Sejarah** — rekod percubaan terkini disimpan dalam pelayar

## Jalankan Secara Tempatan

```bash
cd C:\Users\Wofieee\Projects\pengurusan-pendidikan-mcq
npm install
npm run dev
```

Buka URL yang dipaparkan (biasanya `http://localhost:5173`).

## Terbitan Langsung (GitHub Pages)

**URL langsung:** https://miruladzim.github.io/pengurusan-pendidikan-mcq/

Setiap push ke `master` akan membina semula dan menerbitkan laman web secara automatik melalui GitHub Actions.

## Bina untuk Pengeluaran

```bash
npm run build
```

Output statik berada dalam folder `dist/`. Boleh dihoskan di Netlify, Vercel, atau GitHub Pages.

## Menjana Semula Soalan

Soalan disimpan dalam `src/data/exam-sets/`. Untuk menjana semula daripada skrip:

```bash
node scripts/generate-questions.mjs
```

## Struktur Topik (10 topik × 4 soalan/set)

1. Konsep dan Proses Pengurusan
2. Fungsi Pengurusan dan Kepimpinan
3. Perancangan Pendidikan
4. Belanjawan
5. Sekolah Sebagai Tempat Pengajaran dan Pembelajaran
6. Budaya dan Iklim Organisasi
7. Komunikasi di Sekolah
8. Pengurusan Bilik Darjah
9. Pengurusan Kualiti dalam Pendidikan
10. Sekolah dan Masa Depan

## Teknologi

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- localStorage / sessionStorage (tiada pelayan diperlukan)
