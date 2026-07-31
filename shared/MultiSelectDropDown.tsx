'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  // Optional richer row content (e.g. follower range, min cost) — when present,
  // the dropdown renders a multi-line row instead of a plain label.
  sublabel?: string;
  meta?: string;
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

  const selectedOptions = options.filter((o) => selected.includes(o.value));

  return (
    <div className="relative" ref={containerRef}>
      <div
        role="button"
        tabIndex={disabled || loading ? -1 : 0}
        aria-disabled={disabled || loading}
        onClick={() => !(disabled || loading) && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !(disabled || loading)) {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className={cn(
          'w-full min-h-10 flex items-center justify-between gap-2 border rounded-md px-3 py-1.5 text-sm transition-colors bg-white cursor-pointer',
          open ? 'border-brand-pink ring-2 ring-brand-pink/10' : 'border-[#e8e6f0]',
          (disabled || loading) && 'opacity-60 cursor-not-allowed',
        )}
      >
        {loading ? (
          <span className="truncate text-left text-[#9a99b0]">Loading…</span>
        ) : selectedOptions.length === 0 ? (
          <span className="truncate text-left text-[#9a99b0]">{placeholder}</span>
        ) : (
          <span className="flex flex-wrap items-center gap-1.5 text-left">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 bg-brand-pink/10 text-brand-pink rounded-full pl-2.5 pr-1.5 py-0.5 text-xs font-medium"
              >
                {option.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleValue(option.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleValue(option.value);
                    }
                  }}
                  className="rounded-full hover:bg-brand-pink/20 transition-colors p-0.5 cursor-pointer"
                >
                  <X size={11} />
                </span>
              </span>
            ))}
          </span>
        )}
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-[#7a7a9a] transition-transform', open && 'rotate-180')}
        />
      </div>

      {open && !loading && (
        <div className="absolute z-20 mt-1.5 w-full max-h-64 overflow-y-auto bg-white border border-[#e8e6f0] rounded-md shadow-lg py-2">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[#9a99b0]">No options available</p>
          ) : (
            options.map((option) => {
              const checked = selected.includes(option.value);
              const isRich = option.sublabel !== undefined || option.meta !== undefined;

              if (!isRich) {
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
              }

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleValue(option.value)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    checked
                      ? 'bg-brand-pink/10 text-brand-pink'
                      : 'text-[#1a1a2e] hover:bg-[#faf9fc]',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                      checked ? 'bg-brand-pink border-brand-pink' : 'border-[#e8e6f0]',
                    )}
                  >
                    {checked && <Check size={11} className="text-white" strokeWidth={3} />}
                  </span>
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="text-sm font-medium shrink-0">{option.label}</span>
                    {option.sublabel && (
                      <span
                        className={cn(
                          'text-xs shrink-0',
                          checked ? 'text-brand-pink/70' : 'text-[#9a99b0]',
                        )}
                      >
                        {option.sublabel}
                      </span>
                    )}
                  </span>
                  {option.meta && (
                    <span
                      className={cn(
                        'ml-auto text-xs truncate',
                        checked ? 'text-brand-pink/70' : 'text-[#9a99b0]',
                      )}
                    >
                      {option.meta}
                    </span>
                  )}
                  <ChevronRight
                    size={14}
                    className={cn('shrink-0', checked ? 'text-brand-pink' : 'text-[#c4c2d4]')}
                  />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
