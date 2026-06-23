"use client";

import PhoneInputWithCountry, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  return (
    <div>
      <label htmlFor="phone" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <i className="ti ti-phone text-slate-400" aria-hidden="true" />
        Phone
      </label>
      <PhoneInputWithCountry
        international
        defaultCountry="IN"
        value={value as Value}
        onChange={(val) => onChange(val ?? "")}
        placeholder="Enter phone number"
        numberInputProps={{
          id: "phone",
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? "phone-error" : undefined,
        }}
        className={`rounded-lg border bg-white/80 px-1 shadow-inner ${
          error ? "border-red-400" : "border-slate-200 focus-within:border-brand-cyan/60"
        }`}
      />
      {error && (
        <p id="phone-error" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
