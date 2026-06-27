"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { GsapHoverProvider } from "@/components/ui/gsap-hover-provider";
import { RouteLoadingIndicator } from "@/components/ui/route-loading-indicator";

type AppShellProps = {
  children: ReactNode;
  businessName?: string;
};

const pageMeta = [
  {
    match: "/dashboard",
    title: "Dashboard",
    description:
      "Pantau penjualan, pengeluaran, stok, dan aktivitas usaha dalam satu tampilan.",
  },
  {
    match: "/transactions",
    title: "Transaksi",
    description: "Kelola pemasukan dan pengeluaran usaha secara rapi.",
  },
  {
    match: "/products",
    title: "Produk",
    description: "Kelola katalog produk, harga modal, harga jual, dan stok.",
  },
  {
    match: "/stocks",
    title: "Stok",
    description:
      "Catat stok masuk, stok keluar, dan produk yang perlu segera diisi ulang.",
  },
  {
    match: "/reports",
    title: "Laporan Laba Rugi",
    description:
      "Lihat ringkasan pemasukan, pengeluaran, dan estimasi laba usaha.",
  },
  {
    match: "/assistant",
    title: "AI Assistant",
    description: "Tanyakan kondisi usaha berdasarkan data yang sudah dicatat.",
  },
  {
    match: "/settings",
    title: "Pengaturan",
    description: "Kelola profil usaha, mode contoh data, dan kontrol data.",
  },
  {
    match: "/onboarding",
    title: "Profil Usaha",
    description: "Lengkapi profil usaha untuk mulai menggunakan aplikasi.",
  },
];

export function AppShell({
  children,
  businessName = "AI UMKM",
}: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    setIsRouteLoading(false);
  }, [pathname]);

  const meta = useMemo(() => {
    return (
      pageMeta.find((item) => pathname.startsWith(item.match)) ?? pageMeta[0]
    );
  }, [pathname]);

  return (
    <div className="app-shell">
      <RouteLoadingIndicator isLoading={isRouteLoading} />
      <GsapHoverProvider />

      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`} id="sidebar">
        <Link
          href="/dashboard"
          className="brand"
          onClick={() => {
            if (pathname !== "/dashboard") {
              setIsRouteLoading(true);
            }

            setSidebarOpen(false);
          }}
        >
          <div className="brand-mark" aria-hidden="true">
            <Sparkles />
          </div>

          <div className="brand-copy">
            <span>AI UMKM</span>
            <strong>Co-Pilot</strong>
          </div>
        </Link>

        <AppNavigation
          onNavigate={() => setSidebarOpen(false)}
          onStartNavigation={() => setIsRouteLoading(true)}
        />

        <div className="sidebar-footer">
          <div className="mini-card">
            <div className="health">
              <span className="pulse" />
              Bisnis sehat
            </div>

            <small>
              Pantau transaksi, stok, dan laporan usaha dari satu dashboard.
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

            <Link
              href="/transactions/new"
              className="primary-button"
              onClick={() => {
                if (pathname !== "/transactions/new") {
                  setIsRouteLoading(true);
                }
              }}
            >
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