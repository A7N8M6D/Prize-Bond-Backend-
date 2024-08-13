import Bull from 'bull';
import { checkUserBonds } from './bondChecker'; // Import the function you want to run in the background

// Create a Bull queue for bond checking
const bondCheckQueue = new Bull('bond-check-queue', {
  redis: { port: 6379, host: '127.0.0.1' }, // Redis connection details
});

// Process the jobs in the queue
bondCheckQueue.process(async (job) => {
  const { listId } = job.data;
  await checkUserBonds(listId);
});

export { bondCheckQueue };
