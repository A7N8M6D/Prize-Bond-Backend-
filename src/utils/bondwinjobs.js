import Bull from 'bull';
import { BondWin } from "../models/Winbonds.model.js";
import { List } from "../models/list.model.js";
import { Bond } from "../models/bonds.model.js";
import Redis from 'ioredis';
// Configure Redis connection using environment variable
// import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const bondWinQueue = new Bull('bondWinQueue',redisUrl);

export const addBondWinJob = async (listId) => {
  try {
    console.log("Before queued", listId);
    
    // Add job to queue and await it to ensure job is added before logging
    const job =  bondWinQueue.add('processBondWins', { listId });

    console.log("After queued", job.id);
    return { message: 'Job added to the queue and will be processed in the background.' };
  } catch (error) {
    console.error('Error adding job to queue:', error);
    return { message: 'Failed to add job to the queue' };
  }
};

// Job processor
bondWinQueue.process('processBondWins', async (job) => {
  const { listId } = job.data;
  console.log("Job queued now", listId);

  try {
    const list = await List.findById(listId).exec();
    if (!list) {
      throw new Error('List not found');
    }

    const bonds = await Bond.find().exec();
    for (const bond of bonds) {
      const { PrizeBondNumber, user } = bond;
      const { FirstWin, SecondWin, ThirdWin } = list;

      if (PrizeBondNumber.some(num => FirstWin.includes(num))) {
        await BondWin.create({
          PrizeBondType: 1,
          PrizeBondNumber: PrizeBondNumber.find(num => FirstWin.includes(num)),
          user,
          bond: bond._id,
          List: listId,
          Month: list.Month,
          Year: list.Year,
          AmountWin: list.FirstPrize,
          WinPosition: ['First Prize'],
        });
      }

      if (PrizeBondNumber.some(num => SecondWin.includes(num))) {
        await BondWin.create({
          PrizeBondType: 2,
          PrizeBondNumber: PrizeBondNumber.find(num => SecondWin.includes(num)),
          user,
          bond: bond._id,
          List: listId,
          Month: list.Month,
          Year: list.Year,
          AmountWin: list.SecondPrize,
          WinPosition: ['Second Prize'],
        });
      }

      if (PrizeBondNumber.some(num => ThirdWin.includes(num))) {
        await BondWin.create({
          PrizeBondType: 3,
          PrizeBondNumber: PrizeBondNumber.find(num => ThirdWin.includes(num)),
          user,
          bond: bond._id,
          List: listId,
          Month: list.Month,
          Year: list.Year,
          AmountWin: list.ThirdPrize,
          WinPosition: ['Third Prize'],
        });
      }
    }

    console.log('Bond wins processed successfully for list:', listId);
    return { success: true };  // Return something after processing
  } catch (error) {
    console.error('Error processing bond wins:', error);
    throw error;  // Throw error so that it can be caught in the event listener
  }
});

// Listen for job events
bondWinQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});

bondWinQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
