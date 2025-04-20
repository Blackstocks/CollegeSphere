export function calculateRankFromPercentile(percentile: number): number {
  // Total candidates: 13,00,000
  // Formula: Rank = (100 - percentile) * (total candidates / 100)
  const totalCandidates = 1300000
  const rank = Math.round((100 - percentile) * (totalCandidates / 100))
  return Math.max(1, rank) // Ensure rank is at least 1
}
