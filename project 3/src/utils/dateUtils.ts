export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
};

export const calculateDaysPassed = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  return Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export const calculateEstimatedCompletionDate = (
  targetAmount: number,
  dailyTarget: number,
  startDate: string,
  frequency: number
): string => {
  const start = new Date(startDate);
  // 必要な学習回数を計算（端数がある場合は切り上げ）
  const sessionsNeeded = Math.ceil(targetAmount / dailyTarget);
  // 頻度を考慮して必要な日数を計算
  const daysNeeded = (sessionsNeeded - 1) * frequency;
  const completionDate = new Date(start);
  completionDate.setDate(start.getDate() + daysNeeded);
  return completionDate.toLocaleDateString();
};