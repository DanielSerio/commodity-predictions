'use server';

import { PredictionService } from '@/services/prediction.service';
import { revalidatePath } from 'next/cache';

export async function runPredictionJobAction() {
  try {
    const service = new PredictionService();
    await service.runPredictionJob();
    revalidatePath('/predictions');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Action failed:', error);
    return { success: false, error: 'Failed to run prediction job' };
  }
}
