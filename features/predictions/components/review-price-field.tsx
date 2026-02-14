'use client';

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ReviewPriceFieldProps {
  register: UseFormRegister<any>;
  error?: string;
  recommendedPrice?: number;
}

export function ReviewPriceField({
  register,
  error,
  recommendedPrice,
}: ReviewPriceFieldProps) {
  return (
    <Field className="space-y-3">
      <FieldLabel
        htmlFor="humanPredictedPrice"
        className="text-sm font-bold uppercase tracking-widest text-muted-foreground"
      >
        Adjusted Price Forecast
      </FieldLabel>
      <FieldContent>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono text-muted-foreground group-focus-within:text-primary transition-colors">
            $
          </span>
          <Input
            id="humanPredictedPrice"
            type="number"
            step="0.01"
            className="pl-10 h-16 text-3xl font-mono font-black border-2 focus-visible:ring-offset-0 focus-visible:ring-primary/20"
            {...register('humanPredictedPrice', { valueAsNumber: true })}
          />
        </div>
        {recommendedPrice !== undefined && (
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            AI recommended:{' '}
            <span className="font-mono font-bold text-emerald-500">
              ${recommendedPrice.toFixed(2)}
            </span>
          </p>
        )}
        <FieldError errors={[{ message: error }]} />
      </FieldContent>
    </Field>
  );
}
