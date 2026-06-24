"use client";

import { useMemo, useState } from "react";

type CurrencyInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
};

function cleanDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatNumberInput(value: string) {
  const digits = cleanDigits(value);

  if (!digits) {
    return "";
  }

  const normalizedDigits = digits.replace(/^0+(?=\d)/, "");

  return new Intl.NumberFormat("id-ID").format(Number(normalizedDigits));
}

function cleanWords(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function numberToIndonesianWords(value: number): string {
  const words = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  if (value === 0) {
    return "nol";
  }

  if (value < 12) {
    return words[value];
  }

  if (value < 20) {
    return cleanWords(`${numberToIndonesianWords(value - 10)} belas`);
  }

  if (value < 100) {
    return cleanWords(
      `${numberToIndonesianWords(Math.floor(value / 10))} puluh ${numberToIndonesianWords(
        value % 10
      )}`
    );
  }

  if (value < 200) {
    return cleanWords(`seratus ${numberToIndonesianWords(value - 100)}`);
  }

  if (value < 1000) {
    return cleanWords(
      `${numberToIndonesianWords(Math.floor(value / 100))} ratus ${numberToIndonesianWords(
        value % 100
      )}`
    );
  }

  if (value < 2000) {
    return cleanWords(`seribu ${numberToIndonesianWords(value - 1000)}`);
  }

  if (value < 1_000_000) {
    return cleanWords(
      `${numberToIndonesianWords(Math.floor(value / 1000))} ribu ${numberToIndonesianWords(
        value % 1000
      )}`
    );
  }

  if (value < 1_000_000_000) {
    return cleanWords(
      `${numberToIndonesianWords(
        Math.floor(value / 1_000_000)
      )} juta ${numberToIndonesianWords(value % 1_000_000)}`
    );
  }

  if (value < 1_000_000_000_000) {
    return cleanWords(
      `${numberToIndonesianWords(
        Math.floor(value / 1_000_000_000)
      )} miliar ${numberToIndonesianWords(value % 1_000_000_000)}`
    );
  }

  return "nominal terlalu besar";
}

export function CurrencyInput({
  id,
  name,
  placeholder = "Contoh: 140.500",
  defaultValue = "",
  required = false,
}: CurrencyInputProps) {
  const [value, setValue] = useState(() => formatNumberInput(String(defaultValue)));

  const numericValue = useMemo(() => {
    const digits = cleanDigits(value);

    if (!digits) {
      return 0;
    }

    return Number(digits);
  }, [value]);

  const words = useMemo(() => {
    if (numericValue <= 0) {
      return "";
    }

    return `${numberToIndonesianWords(numericValue)} rupiah`;
  }, [numericValue]);

  return (
    <div>
      <input
  id={id}
  name={name}
  type="text"
  inputMode="numeric"
  autoComplete="off"
  value={value}
  required={required}
  placeholder={placeholder}
  onChange={(event) => {
    setValue(formatNumberInput(event.target.value));
  }}
/>

      {value ? (
        numericValue > 0 ? (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Terbaca:{" "}
            <span className="font-semibold text-slate-700">Rp{value}</span>{" "}
            <span className="text-slate-400">—</span> {words}
          </p>
        ) : (
          <p className="mt-2 text-xs text-red-600">
            Nominal harus lebih besar dari 0.
          </p>
        )
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          Ketik angka tanpa titik. Contoh: 1750000 akan tampil sebagai 1.750.000.
        </p>
      )}
    </div>
  );
}