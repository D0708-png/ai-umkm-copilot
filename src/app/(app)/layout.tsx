import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUserBusiness } from "@/lib/services/business.service";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const { business } = await getCurrentUserBusiness();

  return (
    <AppShell businessName={business?.name ?? "AI UMKM Co-Pilot"}>
      {children}
    </AppShell>
  );
}