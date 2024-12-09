import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubjects } from '../hooks/useSubjects';
import { useGoals } from '../hooks/useGoals';
import { useStudySessions } from '../hooks/useStudySessions';
import TestResultForm from '../components/records/TestResultForm';
import StudyTimeStats from '../components/records/StudyTimeStats';
import SubjectDistribution from '../components/records/SubjectDistribution';

export default function RecordsPage() {
  const [showTestForm, setShowTestForm] = useState(false);
  const { user } = useAuth();
  const { subjects } = useSubjects(user?.uid);
  const { goals } = useGoals(user?.uid);
  const { 
    getStudyStats,
    getDailyStudyData,
    getSubjectDistribution
  } = useStudySessions(user?.uid);

  const stats = getStudyStats();
  const dailyData = getDailyStudyData();
  const distribution = getSubjectDistribution();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">学習記録</h1>

      <StudyTimeStats stats={stats} dailyData={dailyData} />
      
      <SubjectDistribution distribution={distribution} goals={goals} />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">成績推移</h2>
          <button
            onClick={() => setShowTestForm(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            テスト結果を記録
          </button>
        </div>
        {/* Test results chart will be implemented later */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-center text-gray-500 py-4">
            テスト結果がまだ記録されていません
          </p>
        </div>
      </section>

      {showTestForm && (
        <TestResultForm
          subjects={subjects}
          onSubmit={(data) => {
            console.log(data);
            setShowTestForm(false);
          }}
          onCancel={() => setShowTestForm(false)}
        />
      )}
    </div>
  );
}