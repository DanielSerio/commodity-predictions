'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updatePredictionAction } from '@/app/actions';
import { ReviewPriceField } from './review-price-field';
import { ReviewConfidenceField } from './review-confidence-field';

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
        <ReviewPriceField
          register={register}
          name="humanPredictedPrice"
          error={errors.humanPredictedPrice?.message}
          recommendedPrice={initialData.predictedPrice ?? undefined}
        />

        <ReviewConfidenceField
          value={confidence}
          onChange={(val) =>
            setValue('humanConfidence', val, { shouldValidate: true })
          }
          error={errors.humanConfidence?.message}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-xl font-black uppercase tracking-tighter shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:grayscale"
        disabled={loading}
        data-testid="confirm-review-button"
      >
        {loading ? 'Committing...' : 'Confirm Review'}
      </Button>
    </form>
  );
}
