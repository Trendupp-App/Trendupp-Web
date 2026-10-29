'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone } from 'lucide-react';
import type { AdvertiserOnboardingData, UpdateRepresentativePayload } from '@/types/Onboarding';
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
import { GENDER_OPTIONS } from '@/constants/gender';
import { z } from 'zod';
import { onboardingSchema, Values } from '@/lib/validations/advertiserRepresentativeFormSchema';

type OnboardingValues = z.infer<typeof onboardingSchema>;
import { useUpdateRepresentative } from '@/hooks/useOnboardingMutations';

interface Props {
  onNext: (data: Partial<AdvertiserOnboardingData>) => void;
  defaultValues?: Partial<Values>;
}

export default function StepRepresentative({ onNext, defaultValues }: Props) {
  const { mutate: updateRepresentative, isPending } = useUpdateRepresentative();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaultValues ?? {},
  });

  const gender = useWatch({ control, name: 'gender' });

  function onSubmit(values: OnboardingValues) {
    const payload: UpdateRepresentativePayload = {
      repFirstName: values.firstName,
      repLastName: values.lastName,
      repEmail: values.email,
      repPhone: values.phone,
      gender: values.gender,
    };

    const { gender: repGender, ...rest } = values;
    updateRepresentative(payload, { onSuccess: () => onNext({ ...rest, repGender }) });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {/* First name */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">First name</Label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <Input
            {...register('firstName')}
            placeholder="Enter first name"
            className="border-[#e8e6f0] h-10 pl-9 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
          />
        </div>
        {errors.firstName && <p className="text-[11px] text-red-400">{errors.firstName.message}</p>}
      </div>

      {/* Last name */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Last name</Label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <Input
            {...register('lastName')}
            placeholder="Enter last name"
            className="border-[#e8e6f0] h-10 pl-9 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
          />
        </div>
        {errors.lastName && <p className="text-[11px] text-red-400">{errors.lastName.message}</p>}
      </div>

      {/* Email address */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Email address</Label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <Input
            {...register('email')}
            type="email"
            placeholder="Enter email address"
            className="border-[#e8e6f0] h-10 pl-9 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
          />
        </div>
        {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
      </div>

      {/* Phone number */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Phone number</Label>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
          <Input
            {...register('phone')}
            type="tel"
            placeholder="Enter phone number"
            className="border-[#e8e6f0] h-10 pl-9 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
          />
        </div>
        {errors.phone && <p className="text-[11px] text-red-400">{errors.phone.message}</p>}
      </div>

      {/* Gender */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-light text-[#1a1a2e]">Gender</Label>
        <Select
          value={gender || undefined}
          onValueChange={(v) => setValue('gender', v, { shouldValidate: true })}
        >
          <SelectTrigger className="border-[#e8e6f0] w-full h-10 text-xs font-light focus:ring-brand-pink/30 focus:border-brand-pink">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-[11px] text-red-400">{errors.gender.message}</p>}
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
