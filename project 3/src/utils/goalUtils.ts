/**
 * 1回あたりの目標値を計算する
 * ユーザーの目標日に合わせて適切な1回の目標値を計算する
 * @param targetAmount 総目標量
 * @param totalDays 総日数
 * @param frequency 頻度（何日に1度）
 * @returns 1回あたりの目標値
 */
export const calculateDailyTarget = (targetAmount: number, totalDays: number, frequency: number): number => {
  // 期間内の学習回数を計算
  const totalSessions = Math.floor(totalDays / frequency);
  if (totalSessions === 0) return targetAmount;
  
  // 1回あたりの目標値を計算（小数点以下切り上げ）
  return Math.ceil(targetAmount / totalSessions);
};

/**
 * 総目標量を計算する
 * @param baseAmount 基本数
 * @param repetitions 繰り返し回数
 * @returns 総目標量
 */
export const calculateTotalTarget = (baseAmount: number, repetitions: number): number => {
  return baseAmount * repetitions;
};