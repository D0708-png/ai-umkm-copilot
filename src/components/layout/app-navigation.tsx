"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Coffee,
  LayoutDashboard,
  MessageCircle,
  PieChart,
  ReceiptText,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transaksi",
    href: "/transactions",
    icon: ReceiptText,
  },
  {
    label: "Produk",
    href: "/products",
    icon: Coffee,
  },
  {
    label: "Stok",
    href: "/stocks",
    icon: Boxes,
  },
  {
    label: "Laporan",
    href: "/reports/profit",
    icon: PieChart,
  },
  {
    label: "AI Assistant",
    href: "/assistant",
    icon: MessageCircle,
  },
  {
    label: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  if (href === "/reports/profit") {
    return pathname.startsWith("/reports");
  }

  return pathname.startsWith(href);
}

type AppNavigationProps = {
  onNavigate?: () => void;
};

export function AppNavigation({ onNavigate }: AppNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="nav-list" aria-label="Navigasi utama">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`nav-item ${active ? "is-active" : ""}`}
          >
            <Icon />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}