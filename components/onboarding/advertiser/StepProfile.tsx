'use client';

import { useRef } from 'react';
import { Camera, Building2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { schema, Values } from '@/lib/validations/advertiserProfileSchema';
import { AdvertiserOnboardingData } from '@/types/Onboarding';
import Image from 'next/image';

interface Props {
  onNext: (data: Partial<AdvertiserOnboardingData>) => void;
  defaultValues?: Partial<Values>;
}

const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United Kingdom',
  'United States',
  'Canada',
  'Other',
];
const STATES = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Other'];

export default function StepProfile({ onNext, defaultValues }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const logo = useWatch({ control, name: 'logo' });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setValue('logo', reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 w-full">
      {/* Logo upload */}
      <div className="flex flex-col items-center mb-2">
        <div className="relative w-20 h-20 mb-2">
          <div className="w-20 h-20 border-dashed border-brand-deep-blue rounded-full bg-[#f0eef8] flex items-center justify-center overflow-hidden border">
            {logo ? (
              <Image src={logo} alt="Brand logo" fill className="object-cover rounded-full" />
            ) : (
              <Building2 size={32} className="text-[#9a99b0]" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-deep-blue flex items-center justify-center hover:bg-brand-pink transition-colors"
          >
            <Camera size={14} className="text-white" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm text-brand-pink font-medium hover:underline"
        >
          Upload logo
        </button>
      </div>

      {/* Brand name */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Brand name</Label>
        <Input
          {...register('brandName')}
          placeholder="Enter brand name"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.brandName && <p className="text-[11px] text-red-400">{errors.brandName.message}</p>}
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Bio</Label>
        <Input
          {...register('bio')}
          placeholder="Enter Bio"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        <p className="text-[11px] text-[#9a99b0]">
          Write about your brand e.g previous campaign, project etc
        </p>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Country</Label>
        <Select onValueChange={(v) => setValue('country', v)} defaultValue={defaultValues?.country}>
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-[11px] text-red-400">{errors.country.message}</p>}
      </div>

      {/* State/Region (Optional) */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">State/Region (Optional)</Label>
        <Select onValueChange={(v) => setValue('state', v)} defaultValue={defaultValues?.state}>
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select State/region" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City (Optional) */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">City (Optional)</Label>
        <Input
          {...register('city')}
          placeholder="Enter City"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
      </div>

      {/* Website (Optional) */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Website (Optional)</Label>
        <Input
          {...register('website')}
          placeholder="Enter website url"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.website && <p className="text-[11px] text-red-400">{errors.website.message}</p>}
      </div>

      {/* Monthly budget */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Monthly budget</Label>
        <Input
          {...register('monthlyBudget')}
          type="number"
          placeholder="Enter monthly budget"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.monthlyBudget && (
          <p className="text-[11px] text-red-400">{errors.monthlyBudget.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        Continue
      </Button>
    </form>
  );
}
