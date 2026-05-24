"use client";
import React, { FC } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (val: string) => void;
  options: Option[];
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  placeholder?: string;
}

const Select: FC<SelectProps> = ({ value, onChange, options, disabled = false, error = false, hint, placeholder }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`h-11 w-full rounded-lg border px-4 py-2 text-sm appearance-none
          ${error ? "border-red-500" : "border-gray-300"} 
          focus:ring-3 focus:ring-blue-200`}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-500"}`}>{hint}</p>}
    </div>
  );
};

export default Select;
