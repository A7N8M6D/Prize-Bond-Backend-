import Bull from 'bull';
import { BondWin } from "../models/Winbonds.model.js";
import { List } from "../models/list.model.js";
import { Bond } from "../models/bonds.model.js";




const bondWinQueue = new Bull('bondWinQueue', 'redis://127.0.0.1:6379'); // Adjust Redis connection as needed

export const addBondWinJob = async (listId) => {
  try {
    
console.log("Before queued",listId)
    // Add job to queue (this should be quick)
    await bondWinQueue.add({'processBondWins': listId} );
    console.log("after queued")
    // Immediately return a response to avoid timeout
    return res.status(200).json({ message: 'Job added to the queue and will be processed in the background.' });
  } catch (error) {
    console.error('Error adding job to queue:', error);
    return res.status(500).json({ message: 'Failed to add job to the queue.' });
  }
};

// Job processor
bondWinQueue.process('processBondWins', async (job) => {
  const { listId } = job.data;
  console.log("job queued now", listId)

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
  } catch (error) {
    console.error('Error processing bond wins:', error);
  }
});
