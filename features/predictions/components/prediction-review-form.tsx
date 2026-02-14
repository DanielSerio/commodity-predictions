'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';

import { updatePredictionAction } from '@/app/actions';

const formSchema = z.object({
  humanPredictedPrice: z.number().min(0, 'Price must be positive'),
  humanConfidence: z.number().min(0, 'Min 0%').max(100, 'Max 100%'),
});

type FormValues = z.infer<typeof formSchema>;

interface PredictionReviewFormProps {
  predictionId: number;
  initialData: {
    predictedPrice: number | null;
    modelConfidence: number;
    humanPredictedPrice: number | null;
    humanConfidence: number | null;
  };
}

export function PredictionReviewForm({
  predictionId,
  initialData,
}: PredictionReviewFormProps) {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      humanPredictedPrice:
        initialData.humanPredictedPrice ?? initialData.predictedPrice ?? 0,
      humanConfidence: initialData.humanConfidence ?? 50,
    },
  });

  const confidence = watch('humanConfidence');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const result = await updatePredictionAction(predictionId, data);
      if (result.success) {
        toast.success('Review saved and saved to prediction history');
      } else {
        toast.error(result.error || 'Failed to save review');
      }
    } catch {
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="space-y-6">
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
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
              AI recommended:{' '}
              <span className="font-mono font-bold text-emerald-500">
                ${initialData.predictedPrice?.toFixed(2)}
              </span>
            </p>
            <FieldError
              errors={[{ message: errors.humanPredictedPrice?.message }]}
            />
          </FieldContent>
        </Field>

        <Field className="space-y-5">
          <div className="flex justify-between items-end">
            <FieldLabel className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Human Confidence Level
            </FieldLabel>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black font-mono text-primary">
                {confidence}
              </span>
              <span className="text-sm font-bold text-muted-foreground">%</span>
            </div>
          </div>
          <FieldContent>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[confidence]}
              onValueChange={(vals: number[]) =>
                setValue('humanConfidence', vals[0], { shouldValidate: true })
              }
              className="py-4"
            />
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              <span>Speculative</span>
              <span>Certain</span>
            </div>
            <FieldError
              errors={[{ message: errors.humanConfidence?.message }]}
            />
          </FieldContent>
        </Field>
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-xl font-black uppercase tracking-tighter shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:grayscale"
        disabled={loading}
      >
        {loading ? 'Committing...' : 'Confirm Review'}
      </Button>
    </form>
  );
}
