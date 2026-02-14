import { getAllCommodities, getCommodityById } from '@/repositories/commodities';
import { getAllModels, getActiveModel } from '@/repositories/models';
import { getPricesByCommodityId } from '@/repositories/prices';
import { createJob, updateJob } from '@/repositories/jobs';
import { createPrediction } from '@/repositories/predictions';
import { getAllJobStatuses } from '@/repositories/job-status';
import { predictPrice } from './ollama.service';

/**
 * Runs a prediction job. When commodityId is provided, only that commodity
 * is predicted using the active model. Otherwise, all commodities are
 * predicted using all prediction-categorized models.
 */
export async function runPredictionJob(commodityId?: number) {
  let commodities;
  if (commodityId) {
    const commodity = getCommodityById(commodityId);
    if (!commodity) throw new Error(`Commodity ${commodityId} not found`);
    commodities = [commodity];
  } else {
    commodities = getAllCommodities();
    if (commodities.length === 0) throw new Error('No commodities found');
  }

  // Single-commodity jobs use the active model; bulk jobs use all prediction models
  let models;
  if (commodityId) {
    const active = getActiveModel();
    if (!active) throw new Error('No active model configured');
    models = [active];
  } else {
    models = getAllModels().filter((m) => m.category === 'prediction');
  }
  const statuses = getAllJobStatuses();

  const pendingStatus = statuses.find((s) => s.slug === 'pending');
  const runningStatus = statuses.find((s) => s.slug === 'running');
  const completedStatus = statuses.find((s) => s.slug === 'completed');
  const failedStatus = statuses.find((s) => s.slug === 'failed');

  if (!pendingStatus || !runningStatus || !completedStatus || !failedStatus) {
    throw new Error('Required job statuses not found in database');
  }

  const job = createJob({
    name: commodityId
      ? `Prediction Job - ${commodities[0].name} - ${new Date().toLocaleString()}`
      : `Prediction Job - ${new Date().toLocaleString()}`,
    statusId: pendingStatus.id,
    totalItems: commodities.length * models.length,
    processedItems: 0,
    progress: 0,
  });

  updateJob(job.id, { statusId: runningStatus.id });

  let processedCount = 0;
  let errorCount = 0;
  const totalCount = commodities.length * models.length;

  // Compute target date once (Issue 10)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 1);
  targetDate.setHours(0, 0, 0, 0);

  try {
    for (const commodity of commodities) {
      const prices = getPricesByCommodityId(commodity.id);
      // Get last 10 prices for context
      const historicalData = prices.slice(-10).map((p) => ({
        date: p.date.toISOString(),
        price: p.price,
      }));

      for (const model of models) {
        try {
          console.log(
            `Running prediction for ${commodity.name} using ${model.name}...`
          );
          const prediction = await predictPrice(
            model.name,
            commodity.name,
            historicalData
          );

          createPrediction({
            jobId: job.id,
            commodityId: commodity.id,
            modelId: model.id,
            modelConfidence: prediction.confidence,
            predictedPrice: prediction.predictedPrice,
            predictionDate: targetDate,
          });
        } catch (err) {
          console.error(
            `Failed prediction for ${commodity.name} with ${model.name}:`,
            err
          );
          errorCount++;
        }

        processedCount++;
        updateJob(job.id, {
          processedItems: processedCount,
          progress: Math.round((processedCount / totalCount) * 100),
        });
      }
    }

    // Determine final status based on errors
    // PR Review: Mark job as failed if any prediction fails
    const finalStatusId =
      errorCount > 0 ? failedStatus.id : completedStatus.id;

    updateJob(job.id, {
      statusId: finalStatusId,
      endedAt: new Date(),
    });

    if (errorCount > 0) {
      console.warn(
        `Prediction job completed with ${errorCount} errors out of ${totalCount}`
      );
    } else {
      console.log('Prediction job completed successfully');
    }
  } catch (error) {
    console.error('Prediction job fatal error:', error);
    updateJob(job.id, {
      statusId: failedStatus.id,
      endedAt: new Date(),
    });
    throw error;
  }
}
