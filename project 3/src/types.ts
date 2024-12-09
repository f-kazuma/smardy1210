import { Timestamp } from 'firebase/firestore';

export interface Subject {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  targetScore?: number | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Goal {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  baseAmount: number;
  repetitions: number;
  targetAmount: number;
  startDate: string;
  endDate: string;
  dailyTarget: number;
  progress: number;
  frequency: number;
  purpose: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StudySession {
  id: string;
  userId: string;
  goalId: string;
  startTime: Timestamp;
  duration: number; // in minutes
  amount: number;
  note?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TestResult {
  id: string;
  userId: string;
  date: string;
  type: 'mock' | 'regular';
  subjects: {
    subjectId: string;
    maxScore: number;
    score: number;
  }[];
  deviation?: number;
  schoolRank?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  date: string;
  type: 'exam' | 'test' | 'deadline' | 'goal';
  description?: string;
  targetScore?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProgressEntry {
  date: string;
  amount: number;
}

export interface GoalFormData {
  title: string;
  baseAmount: number;
  repetitions: number;
  startDate: string;
  endDate: string;
  subjectId: string;
  frequency: number;
  purpose: string;
}

export interface SubjectFormData {
  name: string;
  description?: string;
  targetScore?: number;
}

export interface StudySessionFormData {
  goalId: string;
  startTime: Date;
  duration: number;
  amount: number;
  note?: string;
}

export interface TestResultFormData {
  date: string;
  type: 'mock' | 'regular';
  subjects: {
    subjectId: string;
    maxScore: number;
    score: number;
  }[];
  deviation?: number;
  schoolRank?: string;
}

export interface EventFormData {
  title: string;
  date: string;
  type: 'exam' | 'test' | 'deadline' | 'goal';
  description?: string;
  targetScore?: number;
}

export interface FirestoreData {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}