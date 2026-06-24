import { redirect } from "next/navigation";
import { getCurrentUserBusiness } from "@/lib/services/business.service";
import {
  DangerZone,
  DemoDataControls,
  PreferenceSwitches,
} from "@/components/settings/settings-controls";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const { user, business } = await getCurrentUserBusiness();

  if (!user) {
    redirect("/login?message=Silakan login terlebih dahulu.");
  }

  if (!business) {
    redirect("/onboarding/business");
  }

  const initials = getInitials(business.name) || "AI";

  return (
    <section
      className="content-section is-active"
      id="pengaturan"
      data-title="Pengaturan"
      data-desc="Kelola profil bisnis, preferensi notifikasi, dan data demo."
    >
      {params.message ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#047857", fontWeight: 800 }}>
            {params.message}
          </p>
        </div>
      ) : null}

      {params.error ? (
        <div className="card" style={{ marginBottom: 18, padding: 16 }}>
          <p style={{ color: "#b91c1c", fontWeight: 800 }}>
            {params.error}
          </p>
        </div>
      ) : null}

      <div className="settings-card">
        <article className="card profile-card hover-card">
          <div className="profile-row">
            <div className="avatar">{initials}</div>

            <div>
              <h2>{business.name}</h2>
              <p>
                {business.location || "Lokasi belum diisi"} •{" "}
                {user.email || "Email tidak tersedia"}
              </p>
            </div>
          </div>

          <div className="grid profile-stats">
            <div className="mini-stat">
              <small>Jenis usaha</small>
              <strong>{business.business_type}</strong>
            </div>

            <div className="mini-stat">
              <small>Mata uang</small>
              <strong>{business.currency}</strong>
            </div>

            <div className="mini-stat">
              <small>AI Status</small>
              <strong>Aktif</strong>
            </div>
          </div>
        </article>

        <PreferenceSwitches />
      </div>

      <div className="grid section-grid" style={{ marginTop: 18 }}>
        <DemoDataControls />

        <article className="insight-card hover-card">
          <span className="kicker">Status Sistem</span>
          <h2>Project siap untuk final UI review.</h2>
          <p>
            Auth, profil bisnis, transaksi, produk, stok, laporan, AI Assistant,
            dan demo data sudah terhubung. Setelah UI selesai, kita lanjutkan
            build final dan deploy ke Vercel.
          </p>
        </article>
      </div>

      <div style={{ marginTop: 18 }}>
        <DangerZone />
      </div>
    </section>
  );
}