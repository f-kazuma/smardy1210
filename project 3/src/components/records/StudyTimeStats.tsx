import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudyTimeStatsProps {
  stats: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  dailyData: Array<{
    name: string;
    time: number;
  }>;
}

export default function StudyTimeStats({ stats, dailyData }: StudyTimeStatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">学習時間</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">今日</p>
              <p className="text-lg font-semibold">{formatTime(stats.today)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">今週</p>
              <p className="text-lg font-semibold">{formatTime(stats.week)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">今月</p>
              <p className="text-lg font-semibold">{formatTime(stats.month)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">合計</p>
              <p className="text-lg font-semibold">{formatTime(stats.total)}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatTime(value)}
                labelFormatter={(label: string) => `${label}曜日`}
              />
              <Bar dataKey="time" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}