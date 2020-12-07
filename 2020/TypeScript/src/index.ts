import { DayChallenge } from './common/dayChallenge';

const targetDayNumber = parseInt(process.argv[2]);
const dayString = new String(targetDayNumber).padStart(2, "0");

import(`./day-${dayString}/solution`).then(imported => {
  const solution = new imported.Solution() as DayChallenge;
  solution.run();
});
