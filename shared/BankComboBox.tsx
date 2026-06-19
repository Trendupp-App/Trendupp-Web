'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useBanks } from '@/hooks/useOnboardingQueries';
import { useDebouncedValue } from '@/hooks/useDebounceValue';
import type { Bank } from '@/types/bank';
import React from 'react';

interface BankComboboxProps {
  value?: { id: string; name: string } | null;
  onChange: (bank: Bank) => void;
  error?: string;
}

export function BankCombobox({ value, onChange, error }: BankComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(search, 350);

  const { data: banks = [], isFetching } = useBanks({
    search: debouncedSearch || undefined,
  });

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full h-10 justify-between border-[#e8e6f0] text-xs font-light',
              !value && 'text-muted-foreground',
            )}
          >
            {value ? value.name : 'Select bank'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-1 border"
          align="start"
          sideOffset={10}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search bank name..."
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
              {isFetching && (
                <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin text-brand-pink" /> Searching...
                </div>
              )}
              {!isFetching && <CommandEmpty>No bank found.</CommandEmpty>}
              <CommandGroup>
                {banks.map((bank) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={bank.id}
                    value={bank.id}
                    onSelect={() => {
                      onChange(bank);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value?.id === bank.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{bank.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {bank.country} · {bank.region}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
