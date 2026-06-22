import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { AppNavigation } from "@/components/layout/app-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <Link href="/dashboard" className="block">
          <p className="text-sm font-medium text-emerald-700">
            AI UMKM Co-Pilot
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-950">
            UMKM Dashboard
          </h1>
        </Link>

        <div className="mt-8 flex-1">
          <AppNavigation />
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Keluar
          </button>
        </form>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard">
              <p className="text-xs font-medium text-emerald-700">
                AI UMKM Co-Pilot
              </p>
              <p className="font-bold text-slate-950">UMKM Dashboard</p>
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Keluar
              </button>
            </form>
          </div>
        </header>

        <div className="pb-24 lg:pb-0">{children}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-3 py-3 shadow-lg lg:hidden">
        <AppNavigation variant="bottom" />
      </div>
    </div>
  );
}