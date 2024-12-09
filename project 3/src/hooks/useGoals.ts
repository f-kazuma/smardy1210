import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Goal, GoalFormData, FirestoreData } from '../types';
import { toast } from 'react-hot-toast';
import { calculateDailyTarget, calculateTotalTarget } from '../utils/goalUtils';
import { calculateDaysBetween } from '../utils/dateUtils';

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadGoals();
    } else {
      setGoals([]);
      setLoading(false);
    }
  }, [userId]);

  const loadGoals = async () => {
    if (!userId) return;
    try {
      const q = query(collection(db, 'goals'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const loadedGoals = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Goal, 'id'>),
        id: doc.id,
      }));
      setGoals(loadedGoals);
      setError(null);
    } catch (error) {
      console.error('Error loading goals:', error);
      setError(error as Error);
      toast.error('教材の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (formData: GoalFormData) => {
    if (!userId) throw new Error('User not authenticated');
    try {
      const totalDays = calculateDaysBetween(formData.startDate, formData.endDate);
      const targetAmount = calculateTotalTarget(formData.baseAmount, formData.repetitions);
      const dailyTarget = calculateDailyTarget(targetAmount, totalDays, formData.frequency);
      const now = Timestamp.now();

      const firestoreData: FirestoreData = {
        userId,
        createdAt: now,
        updatedAt: now
      };

      const goalData = {
        ...formData,
        ...firestoreData,
        targetAmount,
        dailyTarget,
        progress: 0
      };

      const docRef = await addDoc(collection(db, 'goals'), goalData);
      const newGoal: Goal = {
        ...goalData,
        id: docRef.id
      };

      setGoals(prev => [...prev, newGoal]);
      toast.success('教材を追加しました');
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('教材の追加に失敗しました');
      throw error;
    }
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    try {
      const goalRef = doc(db, 'goals', id);
      const goal = goals.find(g => g.id === id);
      if (!goal) throw new Error('Goal not found');

      const newProgress = goal.progress + amount;
      const now = Timestamp.now();
      const updateData = {
        progress: newProgress,
        updatedAt: now
      };

      await updateDoc(goalRef, updateData);

      setGoals(prev =>
        prev.map(goal =>
          goal.id === id
            ? { ...goal, ...updateData }
            : goal
        )
      );
      toast.success('進捗を更新しました');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('進捗の更新に失敗しました');
      throw error;
    }
  };

  const updateGoal = async (updatedGoal: Goal) => {
    try {
      const goalRef = doc(db, 'goals', updatedGoal.id);
      const now = Timestamp.now();
      const updateData = {
        title: updatedGoal.title,
        updatedAt: now
      };

      await updateDoc(goalRef, updateData);
      
      setGoals(prev =>
        prev.map(goal =>
          goal.id === updatedGoal.id 
            ? { ...updatedGoal, updatedAt: now }
            : goal
        )
      );
      toast.success('教材を更新しました');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('教材の更新に失敗しました');
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'goals', id));
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('教材を削除しました');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('教材の削除に失敗しました');
      throw error;
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal,
    refreshGoals: loadGoals
  };
}