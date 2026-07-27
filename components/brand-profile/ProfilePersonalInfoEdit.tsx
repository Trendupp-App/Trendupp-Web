'use client';

import { useRef, useState } from 'react';
import { Camera, Building2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
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
import { ComboBox } from '@/shared/ComboBox';
import { useCountries, useStates } from '@/hooks/useOnboardingQueries';
import { useUpdatePersonalInfo } from '@/hooks/useBrandProfileMutations';
import { useAuthStore } from '@/store/authStore';
import { formatNumberWithCommas, stripNonDigits } from '@/utils/Utilities';

const schema = z.object({
  avatar: z.string().optional(),
  brandName: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  country: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().optional(),
  websiteUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  monthlyBudget: z.string().optional(),
});

type Values = z.infer<typeof schema>;

interface ProfilePersonalInfoEditProps {
  onSaved?: () => void;
}

export default function ProfilePersonalInfoEdit({ onSaved }: ProfilePersonalInfoEditProps) {
  const user = useAuthStore((s) => s.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [userSelectedCountryId, setUserSelectedCountryId] = useState<string | undefined>();
  const [avatarError, setAvatarError] = useState<string>('');
  const { data: countries = [], isLoading: loadingCountries } = useCountries();
  const selectedCountryId = userSelectedCountryId;
  const { data: states = [] } = useStates(selectedCountryId);

  const { mutate: updatePersonalInfo, isPending } = useUpdatePersonalInfo();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      brandName: user?.username ?? '',
      email: user?.email ?? '',
      bio: user?.bio ?? '',
    },
  });

  const avatar = useWatch({ control, name: 'avatar' });
  const country = useWatch({ control, name: 'country' });
  const monthlyBudget = useWatch({ control, name: 'monthlyBudget' }) ?? '';
  const currencySymbol = country && country !== 'Nigeria' ? '$' : '₦';

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_BYTES = 4.9 * 1024 * 1024; // 4.9MB

    if (file.size > MAX_BYTES) {
      setAvatarError(
        `Image is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max allowed size is 4.9MB.`,
      );
      e.target.value = ''; // allow re-selecting the same file to re-trigger validation
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setValue('avatar', reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleCountryChange(countryName: string) {
    setValue('country', countryName, { shouldValidate: true });
    setValue('state', '', { shouldValidate: true });
    setUserSelectedCountryId(countries.find((c) => c.name === countryName)?.id);
  }

  function handleMonthlyBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue('monthlyBudget', stripNonDigits(e.target.value), { shouldValidate: true });
  }

  function onSubmit(values: Values) {
    if (avatarError) return;
    const countryId = values.country
      ? countries.find((c) => c.name === values.country)?.id
      : undefined;
    const stateId = values.state ? states.find((s) => s.name === values.state)?.id : undefined;

    updatePersonalInfo(
      {
        ...(values.brandName && { username: values.brandName }),
        ...(values.bio && { bio: values.bio }),
        ...(countryId && { countryId }),
        ...(stateId && { stateId }),
        ...(avatarFile && { avatar: avatarFile }),
      },
      { onSuccess: () => onSaved?.() },
    );
  }

  const avatarSrc = avatar ?? user?.avatarUrl ?? null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-2">
        <div className="relative w-20 h-20 mb-2">
          <div className="w-20 h-20 rounded-full bg-[#f0eef8] flex items-center justify-center overflow-hidden border border-dashed border-[#e8e6f0]">
            {avatarSrc ? (
              <Image src={avatarSrc} alt="Avatar" fill className="object-cover rounded-full" />
            ) : (
              <Building2 size={32} className="text-[#9a99b0]" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a1a4d] flex items-center justify-center hover:bg-brand-pink transition-colors"
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
        <p className="text-xs text-[#9a99b0]">Add a profile picture to stand out</p>
        {avatarError && (
          <p className="text-[11px] text-red-400 text-center max-w-[220px] mt-1">{avatarError}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Brand name</Label>
        <Input
          {...register('brandName')}
          placeholder="Enter brand name"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
        <Input
          {...register('email')}
          type="email"
          disabled
          placeholder="Enter email address"
          className="border-[#e8e6f0] h-10 text-xs font-light disabled:bg-[#faf9fc] disabled:cursor-not-allowed focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Country of Residence</Label>
        <ComboBox
          options={countries.map((c) => ({ value: c.name, label: c.name }))}
          value={country}
          onValueChange={handleCountryChange}
          placeholder="Select Country"
          searchPlaceholder="Search country..."
          loading={loadingCountries}
        />
        {errors.country && <p className="text-[11px] text-red-400">{errors.country.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">State</Label>
        <Select onValueChange={(v) => setValue('state', v, { shouldValidate: true })}>
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Bio</Label>
        <textarea
          {...register('bio')}
          rows={3}
          placeholder="Nigeria's leading beverage brand..."
          className="w-full border border-[#e8e6f0] rounded-lg px-3 py-2.5 text-xs font-light text-[#1a1a2e] resize-none focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/20 placeholder:text-[#c4c2d4]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Website URL (Optional)</Label>
        <Input
          {...register('websiteUrl')}
          placeholder="pepsinigeria.com"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.websiteUrl && (
          <p className="text-[11px] text-red-400">{errors.websiteUrl.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Monthly Marketing Budget</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-light text-[#1a1a2e]">
            {currencySymbol}
          </span>
          <Input
            type="text"
            inputMode="numeric"
            value={formatNumberWithCommas(monthlyBudget)}
            onChange={handleMonthlyBudgetChange}
            placeholder="400,000"
            className="border-[#e8e6f0] h-10 pl-7 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        {isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
