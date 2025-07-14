// components/FormNavSelect.tsx
'use client';

import  Select  from "@/components/form/Select";

interface FormNavSelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FormNavSelect({
  label,
  options,
  value,
  onChange,
  className = ''
}: FormNavSelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        className="w-full"
      />
    </div>
  );
}