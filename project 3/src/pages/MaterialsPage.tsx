import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Goal, Subject, SubjectFormData, GoalFormData } from '../types';
import GoalForm from '../components/GoalForm';
import GoalCard from '../components/GoalCard';
import SubjectForm from '../components/SubjectForm';
import SubjectCard from '../components/SubjectCard';
import { Target, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSubjects } from '../hooks/useSubjects';
import { useGoals } from '../hooks/useGoals';

export default function MaterialsPage() {
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const {
    subjects,
    loading: subjectsLoading,
    addSubject,
    updateSubject,
    deleteSubject
  } = useSubjects(user?.uid);

  const {
    goals,
    loading: goalsLoading,
    addGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal
  } = useGoals(user?.uid);

  const handleSubjectSubmit = async (formData: SubjectFormData) => {
    try {
      await addSubject(formData);
      setShowSubjectForm(false);
    } catch (error) {
      console.error('Error submitting subject:', error);
    }
  };

  const handleSubjectEdit = async (updatedSubject: Subject) => {
    try {
      await updateSubject(updatedSubject);
    } catch (error) {
      console.error('Error editing subject:', error);
    }
  };

  const handleSubjectDelete = async (id: string) => {
    if (!window.confirm('この教科を削除してもよろしいですか？\n※この教科に関連する教材も全て削除されます')) return;

    try {
      // Delete all related goals first
      const relatedGoals = goals.filter(goal => goal.subjectId === id);
      await Promise.all(relatedGoals.map(goal => deleteGoal(goal.id)));
      
      // Then delete the subject
      await deleteSubject(id);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleGoalSubmit = async (formData: GoalFormData) => {
    try {
      await addGoal(formData);
    } catch (error) {
      console.error('Error submitting goal:', error);
    }
  };

  const handleGoalEdit = async (updatedGoal: Goal) => {
    try {
      await updateGoal(updatedGoal);
    } catch (error) {
      console.error('Error editing goal:', error);
    }
  };

  const handleProgressUpdate = async (id: string, amount: number) => {
    try {
      await updateGoalProgress(id, amount);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleGoalDelete = async (id: string) => {
    if (!window.confirm('この教材を削除してもよろしいですか？')) return;
    try {
      await deleteGoal(id);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  if (subjectsLoading || goalsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">学習教材</h1>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">教科一覧</h2>
          <button
            onClick={() => setShowSubjectForm(!showSubjectForm)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showSubjectForm ? '教科の追加をキャンセル' : '教科を追加'}
          </button>
        </div>
        
        {showSubjectForm && <SubjectForm onSubmit={handleSubjectSubmit} />}
        
        <div className="space-y-6">
          {subjects.map(subject => (
            <div key={subject.id} className="space-y-4">
              <SubjectCard
                subject={subject}
                onDelete={handleSubjectDelete}
                onEdit={handleSubjectEdit}
              />
              <div className="ml-4 space-y-4">
                <GoalForm onSubmit={handleGoalSubmit} subjects={subjects} />
                {goals
                  .filter(goal => goal.subjectId === subject.id)
                  .map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onProgressUpdate={handleProgressUpdate}
                      onDelete={handleGoalDelete}
                      onEdit={handleGoalEdit}
                    />
                  ))}
              </div>
            </div>
          ))}
          {subjects.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              教科がまだ登録されていません。新しい教科を追加してください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}