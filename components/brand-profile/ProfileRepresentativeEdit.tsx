'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone } from 'lucide-react';
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
import { schema, Values } from '@/lib/validations/advertiserRepresentativeFormSchema';
import { useUpdateProfileRepresentative } from '@/hooks/useBrandProfileMutations';
import { useAuthStore } from '@/store/authStore';

interface ProfileRepresentativeEditProps {
  onSaved?: () => void;
}

export default function ProfileRepresentativeEdit({ onSaved }: ProfileRepresentativeEditProps) {
  const user = useAuthStore((s) => s.user);
  const { mutate: updateRepresentative, isPending } = useUpdateProfileRepresentative();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.brandRepresentative?.firstName ?? '',
      lastName: user?.brandRepresentative?.lastName ?? '',
      email: user?.brandRepresentative?.email ?? '',
      phone: user?.brandRepresentative?.phone ?? '',
      gender: user?.brandRepresentative?.gender ?? '',
    },
  });

  const gender = useWatch({ control, name: 'gender' });

  function onSubmit(values: Values) {
    updateRepresentative(
      {
        repFirstName: values.firstName,
        repLastName: values.lastName,
        repEmail: values.email,
        repPhone: values.phone,
        // Optional here: only sent when chosen, so an untouched picker keeps what's saved
        ...(values.gender && { gender: values.gender }),
      },
      { onSuccess: () => onSaved?.() },
    );
  }

  const inputCls =
    'border-[#e8e6f0] h-10 pl-9 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {[
        { name: 'firstName' as const, label: 'First name', icon: User, placeholder: 'Alexander' },
        { name: 'lastName' as const, label: 'Last name', icon: User, placeholder: 'Chisom' },
        {
          name: 'email' as const,
          label: 'Email address',
          icon: Mail,
          placeholder: 'alex@example.com',
          type: 'email',
        },
        {
          name: 'phone' as const,
          label: 'Phone number',
          icon: Phone,
          placeholder: '+2349038636233',
          type: 'tel',
        },
      ].map(({ name, label, icon: Icon, placeholder, type }) => (
        <div key={name} className="flex flex-col gap-1">
          <Label className="text-sm font-light text-[#1a1a2e]">{label}</Label>
          <div className="relative">
            <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]" />
            <Input
              {...register(name)}
              type={type ?? 'text'}
              placeholder={placeholder}
              className={inputCls}
            />
          </div>
          {errors[name] && <p className="text-[11px] text-red-400">{errors[name]?.message}</p>}
        </div>
      ))}

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
        className="w-full bg-brand-pink rounded-md h-12 text-[15px] font-light text-white mt-2 disabled:bg-brand-pink/40"
      >
        {isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
