'use client';

import { useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreatorOnboardingData } from '@/types/Onboarding';
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
import { schema, Values } from '@/lib/validations/profileSchema';

interface Props {
  onNext: (data: Partial<CreatorOnboardingData>) => void;
  defaultValues?: Partial<Values>;
}

const NATIONALITIES = [
  'Nigerian',
  'Ghanaian',
  'Kenyan',
  'South African',
  'British',
  'American',
  'Canadian',
  'Other',
];
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const photo = watch('photo');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setValue('photo', reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 w-full">
      {/* Photo upload */}
      <div className="flex flex-col items-center mb-2">
        <div className="relative w-20 h-20 mb-2">
          <div className="w-20 border-dashed border-brand-deep-blue h-20 rounded-full bg-[#f0eef8] flex items-center justify-center overflow-hidden border">
            {photo ? (
              <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#9a99b0]" />
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
          Upload photo
        </button>
      </div>

      {/* Nationality */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Nationality</Label>
        <Select
          onValueChange={(v) => setValue('nationality', v)}
          defaultValue={defaultValues?.nationality}
        >
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select Nationality" />
          </SelectTrigger>
          <SelectContent>
            {NATIONALITIES.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.nationality && (
          <p className="text-[11px] text-red-400">{errors.nationality.message}</p>
        )}
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

      {/* State */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">State</Label>
        <Select onValueChange={(v) => setValue('state', v)} defaultValue={defaultValues?.state}>
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="text-[11px] text-red-400">{errors.state.message}</p>}
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
          Write about your work e.g previous campaign, project etc
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink-light"
      >
        Continue
      </Button>
    </form>
  );
}
