# ADR 0001 — Tech Stack

## Status

Accepted

## Date

2026-06-22

## Context

AI UMKM Co-Pilot adalah aplikasi web mobile-first untuk membantu UMKM kecil mencatat pemasukan, pengeluaran, produk, stok, dan memahami kondisi bisnis melalui AI assistant.

Pada tahap MVP, project membutuhkan stack teknologi yang:

- Cepat untuk dikembangkan
- Mudah dipelajari dan dipelihara
- Cocok untuk web app mobile-first
- Mendukung authentication
- Mendukung database relasional
- Mudah di-deploy
- Bisa dikembangkan menjadi PWA
- Bisa terhubung dengan AI API
- Cocok untuk pengembangan individu atau tim kecil

Karena target awal adalah validasi MVP, stack yang dipilih harus mengutamakan kecepatan pengembangan tanpa mengorbankan struktur project.

---

## Decision

Project AI UMKM Co-Pilot akan menggunakan tech stack berikut:

```txt
Frontend      : Next.js
Language      : TypeScript
Styling       : Tailwind CSS
Backend       : Next.js API Routes / Server Actions
Database      : PostgreSQL
BaaS          : Supabase
Auth          : Supabase Auth
Storage       : Supabase Storage
AI Layer      : AI API
Deployment    : Vercel
Repository    : GitHub
Documentation : Markdown