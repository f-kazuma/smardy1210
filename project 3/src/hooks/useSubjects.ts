import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Subject, SubjectFormData, FirestoreData } from '../types';
import { toast } from 'react-hot-toast';

export function useSubjects(userId: string | undefined) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadSubjects();
    } else {
      setSubjects([]);
      setLoading(false);
    }
  }, [userId]);

  const loadSubjects = async () => {
    if (!userId) return;
    try {
      const q = query(collection(db, 'subjects'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const loadedSubjects = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Subject, 'id'>),
        id: doc.id,
      }));
      setSubjects(loadedSubjects);
      setError(null);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setError(error as Error);
      toast.error('教科の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (formData: SubjectFormData) => {
    if (!userId) throw new Error('User not authenticated');
    try {
      const now = Timestamp.now();
      const firestoreData: FirestoreData = {
        userId,
        createdAt: now,
        updatedAt: now
      };

      // Clean up undefined values to prevent Firebase validation errors
      const subjectData = {
        name: formData.name,
        description: formData.description || null,
        targetScore: formData.targetScore || null,
        ...firestoreData
      };

      const docRef = await addDoc(collection(db, 'subjects'), subjectData);
      const newSubject: Subject = {
        ...subjectData,
        id: docRef.id
      };

      setSubjects(prev => [...prev, newSubject]);
      toast.success('教科を追加しました');
      return newSubject;
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('教科の追加に失敗しました');
      throw error;
    }
  };

  const updateSubject = async (updatedSubject: Subject) => {
    try {
      const subjectRef = doc(db, 'subjects', updatedSubject.id);
      const now = Timestamp.now();
      const updateData = {
        name: updatedSubject.name,
        description: updatedSubject.description || null,
        targetScore: updatedSubject.targetScore || null,
        updatedAt: now
      };

      await updateDoc(subjectRef, updateData);

      setSubjects(prev =>
        prev.map(subject =>
          subject.id === updatedSubject.id 
            ? { ...updatedSubject, updatedAt: now }
            : subject
        )
      );
      toast.success('教科を更新しました');
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('教科の更新に失敗しました');
      throw error;
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      toast.success('教科を削除しました');
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('教科の削除に失敗しました');
      throw error;
    }
  };

  return {
    subjects,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject,
    refreshSubjects: loadSubjects
  };
}