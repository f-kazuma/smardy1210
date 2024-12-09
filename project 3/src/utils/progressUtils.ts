import { Goal } from '../types';
import { calculateDaysPassed } from './dateUtils';

export const calculateExpectedProgress = (goal: Goal): number => {
  const daysPassed = Math.max(0, calculateDaysPassed(goal.startDate));
  const expectedProgress = daysPassed * goal.dailyTarget;
  return Math.min(goal.targetAmount, expectedProgress);
};

export const calculateProgressPercentage = (current: number, total: number): number => {
  return Math.min(100, Math.max(0, (current / total) * 100));
};

export const calculateProgressDifference = (actual: number, expected: number): number => {
  return actual - expected;
};