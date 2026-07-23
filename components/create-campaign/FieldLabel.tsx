'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FieldLabelProps {
  label: string;
  tooltip?: string;
  required?: boolean;
}

export default function FieldLabel({ label, tooltip, required }: FieldLabelProps) {
  const text = (
    <>
      {label}
      {required && <span className="text-red-500"> *</span>}
    </>
  );

  if (!tooltip) {
    return <label className="text-sm font-medium text-[#1a1a2e]">{text}</label>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className="w-fit text-sm font-medium text-[#1a1a2e] cursor-help border-b border-dashed border-[#c4c2d4] outline-none"
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
