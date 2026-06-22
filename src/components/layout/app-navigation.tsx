"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    shortLabel: "Home",
    href: "/dashboard",
  },
  {
    label: "Transaksi",
    shortLabel: "Transaksi",
    href: "/transactions",
  },
  {
    label: "Produk",
    shortLabel: "Produk",
    href: "/products",
  },
  {
    label: "Stok",
    shortLabel: "Stok",
    href: "/stocks",
  },
  {
    label: "Laporan",
    shortLabel: "Laporan",
    href: "/reports/profit",
  },
  {
    label: "AI Assistant",
    shortLabel: "AI",
    href: "/assistant",
  },
];

type AppNavigationProps = {
  variant?: "sidebar" | "bottom";
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  if (href === "/reports/profit") {
    return pathname.startsWith("/reports");
  }

  return pathname.startsWith(href);
}

export function AppNavigation({ variant = "sidebar" }: AppNavigationProps) {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="grid grid-cols-5 gap-1">
        {navItems.slice(0, 5).map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-2 py-2 text-center text-xs font-semibold transition ${
                active
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? "bg-emerald-500 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}