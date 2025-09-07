import { calculateFeedback } from "./solverUtils"

// Returns the guess that minimizes the largest partition size (minimax)
export function getBestPartitionGuess(possibleCodes, allCodes) {
  let bestGuess = possibleCodes[0]
  let minMaxPartition = Infinity
  for (const guess of allCodes) {
    const partitions = {}
    for (const code of possibleCodes) {
      const key = calculateFeedback(guess, code).join(',')
      partitions[key] = (partitions[key] || 0) + 1
    }
    const maxPartition = Math.max(...Object.values(partitions))
    if (maxPartition < minMaxPartition) {
      minMaxPartition = maxPartition
      bestGuess = guess
    }
  }
  return bestGuess
}
