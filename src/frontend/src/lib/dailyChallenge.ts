const DAILY_CHALLENGE_TARGET = 5;
const NANOSECONDS_PER_DAY = 86400 * 1000000000;

export interface DailyChallengeStatus {
  progress: number;
  target: number;
  isComplete: boolean;
}

export function getDailyChallengeStatus(
  progress: number,
  lastScanTimestamp: number
): DailyChallengeStatus {
  const now = Date.now() * 1000000; // Convert to nanoseconds
  const currentDay = Math.floor(now / NANOSECONDS_PER_DAY);
  const lastScanDay = Math.floor(lastScanTimestamp / NANOSECONDS_PER_DAY);

  // Reset progress if it's a new day
  const actualProgress = currentDay > lastScanDay ? 0 : progress;

  return {
    progress: actualProgress,
    target: DAILY_CHALLENGE_TARGET,
    isComplete: actualProgress >= DAILY_CHALLENGE_TARGET,
  };
}
