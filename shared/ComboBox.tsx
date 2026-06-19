'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  sideOffset?: number;
}

export function ComboBox({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  loading = false,
  disabled = false,
  triggerClassName,
  contentClassName,
  sideOffset = 8,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            'w-full justify-between border-[#e8e6f0] h-10 text-xs font-light hover:bg-transparent',
            !selectedLabel && 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {loading && <Loader2 className="size-2 shrink-0 animate-spin text-brand-pink" />}
            <span className="truncate">
              {loading ? 'Loading...' : selectedLabel || placeholder}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-(--radix-popover-trigger-width) p-1 border', contentClassName)}
        align="start"
        sideOffset={sideOffset}
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              listRef.current?.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
          />
          <CommandList
            ref={listRef}
            className="auth-scrollbar"
            style={{
              maxHeight: 'min(16rem, var(--radix-popover-content-available-height, 16rem))',
            }}
          >
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="cursor-pointer"
                  key={option.value}
                  value={option.label}
                  data-checked={option.value === value}
                  onSelect={() => {
                    onValueChange(option.value === value ? '' : option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto size-4',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
