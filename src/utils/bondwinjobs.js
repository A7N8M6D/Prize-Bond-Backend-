import Bull from 'bull';
import { BondWin } from "../models/Winbonds.model.js";
import { List } from "../models/list.model.js";
import { Bond } from "../models/bonds.model.js";
import { createClient } from 'redis';

// Configure Redis connection
const client = createClient({
    password: 'gnoKdJT1qcdwRh1zC4F41heZ3WtCEK37',
    socket: {
        host: 'redis-15526.c242.eu-west-1-2.ec2.redns.redis-cloud.com',
        port: 15526
    }
});

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

// Initialize Bull queue with Redis client
const bondWinQueue = new Bull('bondWinQueue', {
    redis: {
        host: 'redis-15526.c242.eu-west-1-2.ec2.redns.redis-cloud.com',
        port: 15526,
        password: 'gnoKdJT1qcdwRh1zC4F41heZ3WtCEK37'
    }
});

export const addBondWinJob = async (listId) => {
    try {
        console.log("Before queued", listId);
        const job = await bondWinQueue.add('processBondWins', { listId });
        console.log("Job added to queue:", job);
        if (job) {
            console.log("Job ID:", job.id);
        } else {
            console.log("Job object is undefined");
        }
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

// Debugging job events
bondWinQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result: ${result}`);
});

bondWinQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});
