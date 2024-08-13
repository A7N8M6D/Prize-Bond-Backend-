import Queue from 'bull';
import { BondWin } from "../models/Winbonds.model.js";
import { List } from "../models/list.model.js";
import { Bond } from "../models/bonds.model.js";

const bondWinQueue = new Queue('bondWinQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

export const addBondWinJob = async (listId) => {
  await bondWinQueue.add('processBondWins', { listId });
};

// Job processor
bondWinQueue.process('processBondWins', async (job) => {
  const { listId } = job.data;

  try {
    const list = await List.findById(listId).exec();
    if (!list) {
      throw new Error('List not found');
    }

    const bonds = await Bond.find().exec();
    for (const bond of bonds) {
      const { PrizeBondNumber, user } = bond;
      const { FirstWin, SecondWin, ThirdWin } = list;

      // Check if bond numbers match any prize numbers
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
          WinPosition: ['First Prize']
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
          WinPosition: ['Second Prize']
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
          WinPosition: ['Third Prize']
        });
      }
    }
  } catch (error) {
    console.error('Error processing bond wins:', error);
  }
});
