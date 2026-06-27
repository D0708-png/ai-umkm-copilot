"use client";

import { useState } from "react";
import { deleteAllBusinessData } from "@/lib/actions/danger";
import { deleteDemoData, seedDemoData } from "@/lib/actions/demo";

type SliderSwitchProps = {
  label?: string;
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
};

function SliderSwitch({
  label,
  checked,
  onChange,
  ariaLabel,
}: SliderSwitchProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel || label || "Toggle switch"}
      aria-pressed={checked}
      onClick={onChange}
      style={{
        position: "relative",
        width: 52,
        height: 30,
        flex: "0 0 auto",
        padding: 0,
        border: 0,
        borderRadius: 999,
        cursor: "pointer",
        background: checked ? "var(--emerald)" : "#d8dee8",
        boxShadow: checked
          ? "0 10px 22px rgba(16, 185, 129, 0.24)"
          : "inset 0 0 0 1px rgba(15, 23, 42, 0.08)",
        transition: "background 180ms var(--ease), box-shadow 180ms var(--ease)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "#fff",
          boxShadow: "0 6px 14px rgba(15, 23, 42, 0.18)",
          transform: checked ? "translateX(22px)" : "translateX(0)",
          transition: "transform 180ms var(--ease)",
        }}
      />
    </button>
  );
}

function PreferenceRow({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="switch-row">
      <span>{label}</span>
      <SliderSwitch
        checked={checked}
        onChange={() => setChecked((value) => !value)}
        ariaLabel={label}
      />
    </div>
  );
}

export function PreferenceSwitches() {
  return (
    <article className="card toggle-card hover-card">
      <h2>Preferensi</h2>

      <PreferenceRow label="Notifikasi stok rendah" defaultChecked />
      <PreferenceRow label="Ringkasan AI harian" defaultChecked />
      <PreferenceRow label="Laporan otomatis mingguan" />
    </article>
  );
}

export function DemoDataControls() {
  const [showDemoData, setShowDemoData] = useState(false);

  return (
    <article className="card hover-card">
      <div className="panel-header">
        <div>
          <h2>Contoh Data</h2>
          <p>
            Aktifkan panel ini untuk mengisi atau membersihkan contoh data usaha.
          </p>
        </div>

        <SliderSwitch
          checked={showDemoData}
          onChange={() => setShowDemoData((value) => !value)}
          ariaLabel="Tampilkan atau sembunyikan panel contoh data"
        />
      </div>

      {showDemoData ? (
        <div className="quick-actions">
          <form action={seedDemoData}>
            <button className="primary-button" type="submit">
              Isi Contoh Data
            </button>
          </form>

          <form action={deleteDemoData}>
            <button className="ghost-button danger-button" type="submit">
              Bersihkan Contoh Data
            </button>
          </form>

          <div className="stock-row">
            <div className="row-title">
              <strong>Isi contoh</strong>
              <small>
                Produk, stok awal, transaksi bulan ini, dan transaksi pembanding
                untuk membantu mencoba fitur aplikasi.
              </small>
              <div className="bar">
                <span
                  style={
                    {
                      "--w": "100%",
                      "--bar": "var(--emerald)",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <span className="tag income">Siap</span>
          </div>
        </div>
      ) : null}
    </article>
  );
}
export function DangerZone() {
  const [showWarning, setShowWarning] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <article className="card danger-zone-card hover-card">
        <div className="panel-header">
          <div>
            <h2>Yakin ingin menghapus seluruh data usaha?</h2>
              <p>
                  Semua data usaha yang tersimpan akan dihapus permanen. Tindakan ini tidak
                  bisa dibatalkan.
              </p>
          </div>
        </div>

        <div className="quick-actions">
          <button
            type="button"
            className="ghost-button danger-button"
            onClick={() => setShowWarning(true)}
          >
            Hapus Seluruh Data
          </button>
        </div>
      </article>

      {showWarning ? (
        <div className="modal-backdrop">
          <div className="modal-card warning-card">
            <span className="kicker">Peringatan</span>
            <h2>Yakin ingin menghapus seluruh data?</h2>
            <p>
              Data business profile, kategori, transaksi, produk, stok, dan
              riwayat stok akan dihapus. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowWarning(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="ghost-button danger-button"
                onClick={() => {
                  setShowWarning(false);
                  setShowPasswordModal(true);
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showPasswordModal ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <span className="kicker">Verifikasi Password</span>
            <h2>Masukkan password akun</h2>
            <p>
              Untuk keamanan, masukkan password yang sama dengan password login
              akun ini.
            </p>

            <form action={deleteAllBusinessData} className="auth-form">
              <div className="field">
                <label htmlFor="delete-password">Password</label>
                <input
                  id="delete-password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password akun"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Batal
                </button>

                <button className="ghost-button danger-button" type="submit">
                  Hapus Permanen
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}