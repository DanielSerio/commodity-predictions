import { getAllCommodities } from '@/repositories/commodities';
import { getAllModels } from '@/repositories/models';
import { getPricesByCommodityId } from '@/repositories/prices';
import { createJob, updateJob } from '@/repositories/jobs';
import { createPrediction } from '@/repositories/predictions';
import { getAllJobStatuses } from '@/repositories/job-status';
import { OllamaService } from './ollama.service';

export class PredictionService {
  constructor(private ollamaService: OllamaService = new OllamaService()) { }

  async runPredictionJob() {
    const commodities = await getAllCommodities();
    const models = (await getAllModels()).filter(m => m.name !== 'nomic-embed-text:latest'); // Filter out embedding models
    const statuses = await getAllJobStatuses();

    const pendingStatus = statuses.find(s => s.slug === 'pending');
    const runningStatus = statuses.find(s => s.slug === 'running');
    const completedStatus = statuses.find(s => s.slug === 'completed');
    const failedStatus = statuses.find(s => s.slug === 'failed');

    if (!pendingStatus || !runningStatus || !completedStatus || !failedStatus) {
      throw new Error('Required job statuses not found in database');
    }

    const job = createJob({
      name: `Prediction Job - ${new Date().toLocaleString()}`,
      statusId: pendingStatus.id,
      totalItems: commodities.length * models.length,
      processedItems: 0,
      progress: 0,
    });

    updateJob(job.id, { statusId: runningStatus.id });

    let processedCount = 0;
    const totalCount = commodities.length * models.length;

    try {
      for (const commodity of commodities) {
        const prices = getPricesByCommodityId(commodity.id);
        // Get last 10 prices for context
        const historicalData = prices.slice(-10).map(p => ({
          date: p.date.toISOString(),
          price: p.price,
        }));

        for (const model of models) {
          try {
            console.log(`Running prediction for ${commodity.name} using ${model.name}...`);
            const prediction = await this.ollamaService.predict(
              model.name,
              commodity.name,
              historicalData
            );

            // Prediction is for the next day
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            createPrediction({
              jobId: job.id,
              commodityId: commodity.id,
              modelId: model.id,
              modelConfidence: prediction.confidence,
              predictedPrice: prediction.predictedPrice,
              predictionDate: tomorrow,
            });
          } catch (err) {
            console.error(`Failed prediction for ${commodity.name} with ${model.name}:`, err);
          }

          processedCount++;
          updateJob(job.id, {
            processedItems: processedCount,
            progress: Math.round((processedCount / totalCount) * 100),
          });
        }
      }

      updateJob(job.id, {
        statusId: completedStatus.id,
        endedAt: new Date(),
      });

      console.log('Prediction job completed successfully');
    } catch (error) {
      console.error('Prediction job failed:', error);
      updateJob(job.id, {
        statusId: failedStatus.id,
        endedAt: new Date(),
      });
      throw error;
    }
  }
}
