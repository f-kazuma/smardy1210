import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StudySession, StudySessionFormData } from '../types';
import { toast } from 'react-hot-toast';

export function useStudySessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadSessions();
    } else {
      setSessions([]);
      setLoading(false);
    }
  }, [userId]);

  const loadSessions = async () => {
    if (!userId) return;
    try {
      const q = query(collection(db, 'studySessions'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const loadedSessions = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<StudySession, 'id'>),
        id: doc.id,
      }));
      setSessions(loadedSessions);
      setError(null);
    } catch (error) {
      console.error('Error loading study sessions:', error);
      setError(error as Error);
      toast.error('学習記録の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (formData: StudySessionFormData) => {
    if (!userId) throw new Error('User not authenticated');
    try {
      const now = Timestamp.now();
      const sessionData = {
        userId,
        startTime: Timestamp.fromDate(formData.startTime),
        duration: formData.duration,
        amount: formData.amount,
        note: formData.note,
        goalId: formData.goalId,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'studySessions'), sessionData);
      const newSession: StudySession = {
        ...sessionData,
        id: docRef.id,
      };

      setSessions(prev => [...prev, newSession]);
      toast.success('学習記録を保存しました');
      return newSession;
    } catch (error) {
      console.error('Error adding study session:', error);
      toast.error('学習記録の保存に失敗しました');
      throw error;
    }
  };

  const getStudyStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      today: 0,
      week: 0,
      month: 0,
      total: 0
    };

    sessions.forEach(session => {
      const sessionDate = session.startTime.toDate();
      const duration = session.duration;

      stats.total += duration;

      if (sessionDate >= today) {
        stats.today += duration;
      }
      if (sessionDate >= thisWeek) {
        stats.week += duration;
      }
      if (sessionDate >= thisMonth) {
        stats.month += duration;
      }
    });

    return stats;
  };

  const getDailyStudyData = () => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dailyData = Array(7).fill(0);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);

    sessions.forEach(session => {
      const sessionDate = session.startTime.toDate();
      if (sessionDate >= weekStart) {
        const dayIndex = sessionDate.getDay();
        dailyData[dayIndex] += session.duration;
      }
    });

    return dailyData.map((time, index) => ({
      name: days[index],
      time
    }));
  };

  const getSubjectDistribution = () => {
    const distribution: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      const { goalId, duration } = session;
      if (distribution[goalId]) {
        distribution[goalId] += duration;
      } else {
        distribution[goalId] = duration;
      }
    });

    return Object.entries(distribution).map(([goalId, time]) => ({
      goalId,
      time
    }));
  };

  return {
    sessions,
    loading,
    error,
    addSession,
    refreshSessions: loadSessions,
    getStudyStats,
    getDailyStudyData,
    getSubjectDistribution
  };
}