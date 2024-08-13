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

    // Set the chunk size for processing bonds
    const bondChunkSize = 100;
    let skip = 0;
    let bonds;

    // Process bonds in chunks
    do {
      bonds = await Bond.find().skip(skip).limit(bondChunkSize).exec();
      skip += bondChunkSize;

      const bondWinPromises = bonds.map(async (bond) => {
        const { PrizeBondNumber, user } = bond;
        const { FirstWin, SecondWin, ThirdWin } = list;

        const winData = [
          { winNumbers: FirstWin, prizeType: 1, amount: list.FirstPrize, position: 'First Prize' },
          { winNumbers: SecondWin, prizeType: 2, amount: list.SecondPrize, position: 'Second Prize' },
          { winNumbers: ThirdWin, prizeType: 3, amount: list.ThirdPrize, position: 'Third Prize' }
        ];

        const bondWinTasks = winData.map(async ({ winNumbers, prizeType, amount, position }) => {
          const winningNumber = PrizeBondNumber.find(num => winNumbers.includes(num));
          if (winningNumber) {
            await BondWin.create({
              PrizeBondType: prizeType,
              PrizeBondNumber: winningNumber,
              user,
              bond: bond._id,
              List: listId,
              Month: list.Month,
              Year: list.Year,
              AmountWin: amount,
              WinPosition: [position]
            });
          }
        });

        return Promise.all(bondWinTasks);
      });

      await Promise.all(bondWinPromises);

    } while (bonds.length > 0); // Continue until all bonds are processed

  } catch (error) {
    console.error('Error processing bond wins:', error);
  }
});
