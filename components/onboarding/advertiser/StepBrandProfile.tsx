'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Building2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { schema, Values } from '@/lib/validations/advertiserProfileSchema';
import { AdvertiserOnboardingData, BrandProfilePayload } from '@/types/Onboarding';
import Image from 'next/image';
import { useCountries, useStates, useMarketingBudgets } from '@/hooks/useOnboardingQueries';
import { useUpdateProfile } from '@/hooks/useOnboardingMutations';
import { toast } from 'sonner';
import { ComboBox } from '@/shared/ComboBox';
interface Props {
  onNext: (data: Partial<AdvertiserOnboardingData>) => void;
  defaultValues?: Partial<Values>;
}

export default function StepBrandProfile({ onNext, defaultValues }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [userSelectedCountryId, setUserSelectedCountryId] = useState<string | undefined>();

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
      brandName: defaultValues?.brandName ?? user?.username ?? '',
    },
  });

  const logo = useWatch({ control, name: 'logo' });
  const country = useWatch({ control, name: 'country' });
  const budgetCurrency = country && country !== 'Nigeria' ? 'USD' : 'NGN';
  const { data: marketingBudgets = [], isLoading: loadingBudgets } =
    useMarketingBudgets(budgetCurrency);

  useEffect(() => {
    if (!defaultValues?.brandName && user?.username) {
      setValue('brandName', user.username);
    }
  }, [user?.username, defaultValues?.brandName, setValue]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setValue('logo', reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleCountryChange(countryName: string) {
    setValue('country', countryName, { shouldValidate: true });
    setValue('state', '', { shouldValidate: true });
    // Budget ranges are currency-specific, so a stale selection from the
    // previous country's currency can't carry over.
    setValue('monthlyBudget', '', { shouldValidate: true });
    setUserSelectedCountryId(countries.find((c) => c.name === countryName)?.id);
  }

  function onSubmit(values: Values) {
    const countryId = countries.find((c) => c.name === values.country)?.id;
    const stateId = states.find((s) => s.name === values.state)?.id;

    if (!countryId || !stateId) {
      toast.error('Please select a valid country and state');
      return;
    }

    const payload: BrandProfilePayload = {
      countryId,
      stateId,
      ...(values.brandName && { brandName: values.brandName }),
      ...(values.city && { city: values.city }),
      ...(values.bio && { bio: values.bio }),
      ...(values.website && { websiteUrl: values.website }),
      ...(values.monthlyBudget && { monthlyBudget: values.monthlyBudget }),
      ...(logoFile && { avatar: logoFile }),
    };

    updateProfile(payload, { onSuccess: () => onNext(values) });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
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
            className="absolute bottom-0 cursor-pointer right-0 w-7 h-7 rounded-full bg-brand-deep-blue flex items-center justify-center hover:bg-brand-pink transition-colors"
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

      {/* BrandName */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Brand Name</Label>
        <Input
          {...register('brandName')}
          placeholder="Enter Brand Name"
          className="border-[#e8e6f0] h-10 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
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

      {/* State*/}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">State/Region (Optional)</Label>
        <Select
          onValueChange={(v) => setValue('state', v, { shouldValidate: true })}
          defaultValue={defaultValues?.state}
        >
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select State/region" />
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

      {/* Bio */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Bio</Label>
        <Textarea
          {...register('bio')}
          placeholder="Enter Bio"
          rows={3}
          className="border-[#e8e6f0] text-xs font-light resize-none focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
        />
        <p className="text-[11px] text-[#9a99b0]">
          Write about your brand e.g previous campaign, project etc
        </p>
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
        <Select
          onValueChange={(v) => setValue('monthlyBudget', v, { shouldValidate: true })}
          defaultValue={defaultValues?.monthlyBudget}
        >
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder={loadingBudgets ? 'Loading…' : 'Select monthly budget'} />
          </SelectTrigger>
          <SelectContent>
            {marketingBudgets.map((b) => (
              <SelectItem key={b.id} value={b.value}>
                {b.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.monthlyBudget && (
          <p className="text-[11px] text-red-400">{errors.monthlyBudget.message}</p>
        )}
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
