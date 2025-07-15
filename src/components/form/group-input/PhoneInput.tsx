"use client";
import React, { useState, useEffect } from "react";

interface CountryCode {
  code: string;
  label: string;
  example: string;
}

interface PhoneInputProps {
  countries: CountryCode[];
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end";
  value?: string;
  defaultValue?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  onChange,
  selectPosition = "start",
  value = "",
  defaultValue = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(countries[0]?.code || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setPhoneNumber(value);
    }
  }, [value]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    const newPhoneNumber = "";
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  const selectedPlaceholder =
    countries.find((c) => c.code === selectedCountry)?.example || "";

  return (
    <div className="relative flex">
      {selectPosition === "start" && (
        <div className="absolute">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="appearance-none bg-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none bg-none right-3 dark:text-gray-400">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={selectedPlaceholder}
        className={`dark:bg-dark-900 h-11 w-full ${
          selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"
        } rounded-lg border border-gray-300 bg-transparent py-3 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
      />

      {selectPosition === "end" && (
        <div className="absolute right-0">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="appearance-none bg-none rounded-r-lg border-0 border-l border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
