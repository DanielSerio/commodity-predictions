'use client';

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';

interface ReviewConfidenceFieldProps {
  value: number;
  onChange: (val: number) => void;
  error?: string;
}

export function ReviewConfidenceField({
  value,
  onChange,
  error,
}: ReviewConfidenceFieldProps) {
  return (
    <Field className="space-y-5">
      <div className="flex justify-between items-end">
        <FieldLabel className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Human Confidence Level
        </FieldLabel>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black font-mono text-primary">
            {value}
          </span>
          <span className="text-sm font-bold text-muted-foreground">%</span>
        </div>
      </div>
      <FieldContent>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="py-4"
          data-testid="review-confidence-slider"
        />
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
          <span>Speculative</span>
          <span>Certain</span>
        </div>
        <FieldError errors={[{ message: error }]} />
      </FieldContent>
    </Field>
  );
}
