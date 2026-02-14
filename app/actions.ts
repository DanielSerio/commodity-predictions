'use server';

import { PredictionService } from '@/services/prediction.service';
import { revalidatePath } from 'next/cache';
import { updatePrediction } from '@/repositories/predictions';

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

export async function updatePredictionAction(
  id: number,
  data: { humanPredictedPrice: number; humanConfidence: number; }
) {
  try {
    await updatePrediction(id, {
      ...data,
      updatedAt: new Date(),
    });
    revalidatePath(`/predictions/${id}`);
    revalidatePath('/predictions');
    return { success: true };
  } catch (error) {
    console.error('Update action failed:', error);
    return { success: false, error: 'Failed to update prediction' };
  }
}
