import { db } from '../lib/db';
import * as schema from '../lib/db/schema';

function main() {
  console.log('Seeding database...');

  // Seed Commodities
  const commodityData = [
    { name: 'Gold', slug: 'gold', symbol: 'XAU' },
    { name: 'Silver', slug: 'silver', symbol: 'XAG' },
    { name: 'Copper', slug: 'copper', symbol: 'HG' },
    { name: 'Platinum', slug: 'platinum', symbol: 'XPT' },
    { name: 'Palladium', slug: 'palladium', symbol: 'XPD' },
  ];

  for (const item of commodityData) {
    db.insert(schema.commodities).values(item).onConflictDoNothing().run();
  }

  // Seed Models
  const modelData = [
    { name: 'tinyllama:latest', slug: 'tinyllama-latest' },
    { name: 'phi3:mini', slug: 'phi3-mini' },
    { name: 'nomic-embed-text:latest', slug: 'nomic-embed-text-latest' },
    { name: 'llama3.2:latest', slug: 'llama3-2-latest' },
  ];

  for (const item of modelData) {
    db.insert(schema.models).values(item).onConflictDoNothing().run();
  }

  // Seed Job Statuses
  const statusData = [
    { name: 'Pending', slug: 'pending' },
    { name: 'Running', slug: 'running' },
    { name: 'Completed', slug: 'completed' },
    { name: 'Failed', slug: 'failed' },
  ];

  for (const item of statusData) {
    db.insert(schema.jobStatus).values(item).onConflictDoNothing().run();
  }

  console.log('Seeding completed!');
}

main();
