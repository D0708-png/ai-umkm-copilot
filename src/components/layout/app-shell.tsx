"use client";

import type { ReactNode } from "react";
import { GsapHoverProvider } from "@/components/ui/gsap-hover-provider";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { AppNavigation } from "@/components/layout/app-navigation";

type AppShellProps = {
  children: ReactNode;
  businessName?: string;
};

const pageMeta = [
  {
    match: "/dashboard",
    title: "Dashboard",
    description:
      "Ringkasan performa hari ini, rekomendasi AI, dan sinyal bisnis yang perlu dipantau.",
  },
  {
    match: "/transactions",
    title: "Transaksi",
    description: "Catat dan pantau pemasukan serta pengeluaran usaha.",
  },
  {
    match: "/products",
    title: "Produk",
    description: "Kelola katalog produk, margin, dan stok minimum secara cepat.",
  },
  {
    match: "/stocks",
    title: "Stok",
    description:
      "Pantau stok masuk, stok keluar, dan prioritas restock untuk produk usaha.",
  },
  {
    match: "/reports",
    title: "Laporan Laba Rugi",
    description:
      "Laporan visual untuk membantu pemilik melihat sumber laba dan biaya terbesar.",
  },
  {
    match: "/assistant",
    title: "AI Assistant",
    description: "Tanya kondisi bisnis dengan bahasa sehari-hari.",
  },
  {
    match: "/settings",
    title: "Pengaturan",
    description: "Kelola profil bisnis, preferensi, dan data demo.",
  },
  {
    match: "/onboarding",
    title: "Profil Usaha",
    description: "Lengkapi profil bisnis agar aplikasi bisa digunakan.",
  },
];

const rupiah = new Intl.NumberFormat("id-ID");

function formatValue(value: number, prefix = "", suffix = "") {
  return `${prefix}${rupiah.format(Math.round(value))}${suffix}`;
}

export function AppShell({ children, businessName = "AI UMKM" }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const meta = useMemo(() => {
    return (
      pageMeta.find((item) => pathname.startsWith(item.match)) ?? pageMeta[0]
    );
  }, [pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`} id="sidebar">
        <Link href="/dashboard" className="brand" onClick={() => setSidebarOpen(false)}>
          <div className="brand-mark" aria-hidden="true">
            <Sparkles />
          </div>
          <div className="brand-copy">
            <span>AI UMKM</span>
            <strong>Co-Pilot</strong>
          </div>
        </Link>

        <AppNavigation onNavigate={() => setSidebarOpen(false)} />

        <div className="sidebar-footer">
          <div className="mini-card">
            <div className="health">
              <span className="pulse" />
              Bisnis sehat
            </div>
            <small>
              AI membaca penjualan, stok, dan pengeluaran usaha setiap hari.
            </small>

            <form action={logout}>
              <button className="ghost-button" type="submit">
                <LogOut /> Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="page-title">
            <span className="eyebrow">{businessName}</span>
            <h1 id="pageHeading">{meta.title}</h1>
            <p id="pageDescription">{meta.description}</p>
          </div>

          <GsapHoverProvider />

          <div className="toolbar">
            <button
              className="icon-button mobile-toggle"
              type="button"
              aria-label="Buka menu"
              onClick={() => setSidebarOpen((value) => !value)}
            >
              <Menu />
            </button>

            <div className="search-box" role="search">
              <Search />
              <input
                type="search"
                aria-label="Cari data bisnis"
                placeholder="Cari produk, transaksi, laporan..."
              />
            </div>

            <button className="icon-button" type="button" aria-label="Notifikasi">
              <Bell />
            </button>

            <Link href="/transactions/new" className="primary-button">
              <Plus />
              <span>Tambah Transaksi</span>
            </Link>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}