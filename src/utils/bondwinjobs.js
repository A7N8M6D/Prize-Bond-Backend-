import Bull from 'bull';
import { BondWin } from "../models/Winbonds.model.js";
import { List } from "../models/list.model.js";
import { Bond } from "../models/bonds.model.js";
import Redis from 'ioredis';



redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);
const bondWinQueue = new Bull('bondWinQueue', { redis: redisUrl });

export default async (req, res) => {
  const { listId } = req.body;

  try {
    console.log(`Received request to add job for listId: ${listId}`);
    const job = await bondWinQueue.add('processBondWins', { listId });
    console.log(`Job added to queue with ID: ${job.id}`);
    res.status(200).json({ message: 'Job added to the queue' });
  } catch (error) {
    console.error('Error adding job to queue:', error);
    res.status(500).json({ message: 'Failed to add job to the queue' });
  }
};

export const addBondWinJob = async (listId) => {
  try {
    console.log("Before queued", listId);
    const job =  bondWinQueue.add('processBondWins', { listId });
    console.log("Job ID:", job.id);
    return { message: 'Job added to the queue and will be processed in the background.' };
  } catch (error) {
    console.error('Error adding job to queue:', error);
    return { message: 'Failed to add job to the queue' };
  }
};

bondWinQueue.process('processBondWins', async (job) => {
  const { listId } = job.data;
  console.log("Processing job for list:", listId);

  try {
    const list = await List.findById(listId).exec();
    if (!list) {
      throw new Error('List not found');
    }

    const bonds = await Bond.find().exec();
    console.log(`Found ${bonds.length} bonds to process`);
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
    return { success: true };
  } catch (error) {
    console.error('Error in job processing:', error);
    throw error;
  }
});
