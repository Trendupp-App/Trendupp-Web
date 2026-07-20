'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Select',
  loading,
  disabled,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleValue(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  }

  const selectedLabels = options.filter((o) => selected.includes(o.value)).map((o) => o.label);

  const triggerText =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.length} selected`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full h-10 flex items-center justify-between border rounded-md px-3 text-sm transition-colors bg-white',
          open ? 'border-brand-pink ring-2 ring-brand-pink/10' : 'border-[#e8e6f0]',
          selectedLabels.length === 0 ? 'text-[#9a99b0]' : 'text-[#1a1a2e]',
          (disabled || loading) && 'opacity-60 cursor-not-allowed',
        )}
      >
        <span className="truncate text-left">{loading ? 'Loading…' : triggerText}</span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-[#7a7a9a] transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && !loading && (
        <div className="absolute z-20 mt-1.5 w-full max-h-64 overflow-y-auto bg-white border border-[#e8e6f0] rounded-md shadow-lg py-2">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[#9a99b0]">No options available</p>
          ) : (
            options.map((option) => {
              const checked = selected.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-[#1a1a2e] hover:bg-[#faf9fc] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleValue(option.value)}
                    className="w-4 h-4 rounded border-[#e8e6f0] accent-brand-pink focus:ring-brand-pink/20"
                  />
                  {option.label}
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
