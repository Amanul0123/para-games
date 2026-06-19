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
      <label className="mb-1 block text-sm font-medium text-text-dark">
        Phone
      </label>
      <PhoneInputWithCountry
        international
        defaultCountry="IN"
        value={value as Value}
        onChange={(val) => onChange(val ?? "")}
        placeholder="Enter phone number"
        className={`rounded-md border ${
          error ? "border-red-500" : "border-border-gray"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
