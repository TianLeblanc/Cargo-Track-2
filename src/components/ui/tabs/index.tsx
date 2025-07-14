'use client';

import { ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  className?: string;
}

export function Tabs({ children, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

interface TabProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export function Tab({ children, active, onClick, className = '' }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm focus:outline-none transition-colors ${
        active
          ? 'border-b-2 border-primary text-primary dark:text-primary-300'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}