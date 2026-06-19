'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
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
import { useNationalities, useCountries, useStates } from '@/hooks/useOnboardingQueries';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile } from '@/hooks/useOnboardingMutations';
import { toast } from 'sonner';
import { ComboBox } from '@/shared/ComboBox';
import Image from 'next/image';

interface Props {
  onNext: (data: Partial<CreatorOnboardingData>) => void;
  defaultValues?: Partial<Values>;
}

export default function StepProfile({ onNext, defaultValues }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [userSelectedCountryId, setUserSelectedCountryId] = useState<string | undefined>();
  const { data: nationalities = [], isLoading: loadingNationalities } = useNationalities();
  const { data: countries = [], isLoading: loadingCountries } = useCountries();

  const selectedCountryId =
    userSelectedCountryId ?? countries.find((c) => c.name === defaultValues?.country)?.id;
  const { data: states = [] } = useStates(selectedCountryId);

  const user = useAuthStore((s) => s.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      username: defaultValues?.username ?? user?.username ?? '',
    },
  });

  const photo = useWatch({ control, name: 'photo' });
  const nationality = useWatch({ control, name: 'nationality' });
  const country = useWatch({ control, name: 'country' });
  useEffect(() => {
    if (!defaultValues?.username && user?.username) {
      setValue('username', user.username);
    }
  }, [user?.username, defaultValues?.username, setValue]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setValue('photo', reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleCountryChange(countryName: string) {
    setValue('country', countryName, { shouldValidate: true });
    setValue('state', '', { shouldValidate: true });
    const match = countries.find((c) => c.name === countryName);
    setUserSelectedCountryId(match?.id);
  }

  function onSubmit(values: Values) {
    const nationalityId = nationalities.find((n) => n.name === values.nationality)?.id;
    const countryId = countries.find((c) => c.name === values.country)?.id;
    const stateId = states.find((s) => s.name === values.state)?.id;

    if (!nationalityId || !countryId || !stateId) {
      toast.error('Please select a valid nationality, country, and state');
      return;
    }

    updateProfile(
      {
        username: values.username,
        nationalityId,
        countryId,
        stateId,
        bio: values.bio,
      },
      { onSuccess: () => onNext(values) },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {/* Photo upload */}
      <div className="flex flex-col items-center mb-2">
        <div className="relative w-20 h-20 mb-2">
          <div className="w-20 border-dashed border-brand-deep-blue h-20 rounded-full bg-[#f0eef8] flex items-center justify-center overflow-hidden border">
            {photo ? (
              <Image src={photo} alt="Brand logo" fill className="object-cover rounded-full" />
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

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Username</Label>
        <Input
          {...register('username')}
          placeholder="Choose a username"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        {errors.username && <p className="text-[11px] text-red-400">{errors.username.message}</p>}
      </div>

      {/* Nationality */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Nationality</Label>
        <ComboBox
          options={nationalities.map((n) => ({ value: n.name, label: n.name }))}
          value={nationality}
          onValueChange={(v) => setValue('nationality', v, { shouldValidate: true })}
          placeholder="Select Nationality"
          searchPlaceholder="Search nationality..."
          loading={loadingNationalities}
        />
        {errors.nationality && (
          <p className="text-[11px] text-red-400">{errors.nationality.message}</p>
        )}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Country</Label>
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

      {/* State */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">State</Label>
        <Select
          onValueChange={(v) => setValue('state', v, { shouldValidate: true })}
          defaultValue={defaultValues?.state}
        >
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent className="w-64">
            {states?.map((s) => (
              <SelectItem key={s?.id} value={s?.name}>
                {s?.name}
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
        disabled={isPending}
        className="w-full shadow-xl shadow-brand-pink-light bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        {isPending ? 'Saving...' : 'Continue'}
      </Button>
    </form>
  );
}
