import React, { useState } from 'react';
import { Play, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGoals } from '../hooks/useGoals';

export default function HomePage() {
  const { user } = useAuth();
  const { goals } = useGoals(user?.uid);
  const navigate = useNavigate();
  
  const todaysGoals = goals.filter(goal => {
    // Calculate if this goal should be studied today based on frequency
    const startDate = new Date(goal.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart % goal.frequency === 0;
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ホーム</h1>
        <button
          onClick={() => navigate('/study')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
        >
          <Play className="w-5 h-5 mr-2" />
          勉強をする
        </button>
      </div>

      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">今日の目標</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          {todaysGoals.map(goal => (
            <div key={goal.id} className="border-b last:border-b-0 pb-3 last:pb-0">
              <h3 className="font-medium">{goal.title}</h3>
              <p className="text-sm text-gray-600">
                目標: {goal.dailyTarget}ページ
              </p>
            </div>
          ))}
          {todaysGoals.length === 0 && (
            <p className="text-gray-500 text-center py-2">
              今日の目標はありません
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">今日のスケジュール</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          {/* スケジュールの実装は後ほど追加 */}
          <p className="text-gray-500 text-center py-2">
            予定はありません
          </p>
        </div>
      </section>
    </div>
  );
}