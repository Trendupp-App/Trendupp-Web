'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FieldLabelProps {
  label: string;
  tooltip?: string;
}

export default function FieldLabel({ label, tooltip }: FieldLabelProps) {
  if (!tooltip) {
    return <label className="text-sm font-medium text-[#1a1a2e]">{label}</label>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className="w-fit text-sm font-medium text-[#1a1a2e] cursor-help border-b border-dashed border-[#c4c2d4] outline-none"
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
