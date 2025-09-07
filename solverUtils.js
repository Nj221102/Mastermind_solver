export const PEGS = ["U", "D", "R", "L"];
export const SYMBOLS = { U: "↑", D: "↓", R: "→", L: "←" };

export function generateAllCodes() {
  const res = [];
  for (const a of PEGS)
    for (const b of PEGS)
      for (const c of PEGS)
        for (const d of PEGS)
          res.push([a, b, c, d]);
  return res;
}

export function calculateFeedback(guess, secret) {
  let black = 0;
  const guessCounts = { U: 0, D: 0, R: 0, L: 0 };
  const secretCounts = { U: 0, D: 0, R: 0, L: 0 };
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) black++;
    else {
      guessCounts[guess[i]]++;
      secretCounts[secret[i]]++;
    }
  }
  let white = 0;
  for (const p of PEGS) white += Math.min(guessCounts[p], secretCounts[p]);
  return [black, white];
}

export function getBestPartitionGuess(possibleCodes, allCodes) {
  let bestGuess = possibleCodes[0];
  let minMaxPartition = Infinity;
  for (const guess of allCodes) {
    const partitions = {};
    for (const code of possibleCodes) {
      const key = calculateFeedback(guess, code).join(',');
      partitions[key] = (partitions[key] || 0) + 1;
    }
    const maxPartition = Math.max(...Object.values(partitions));
    if (maxPartition < minMaxPartition) {
      minMaxPartition = maxPartition;
      bestGuess = guess;
    }
  }
  return bestGuess;
}
