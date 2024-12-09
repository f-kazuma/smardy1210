import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { Goal } from '../../types';

interface SubjectDistributionProps {
  distribution: Array<{
    goalId: string;
    time: number;
  }>;
  goals: Goal[];
}

export default function SubjectDistribution({ distribution, goals }: SubjectDistributionProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  const data = distribution.map(item => ({
    name: goals.find(goal => goal.id === item.goalId)?.title || '不明な教材',
    value: item.time
  }));

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">教材別学習時間</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#3B82F6"
              label={({ name, value }) => `${name}: ${formatTime(value)}`}
            />
            <Tooltip formatter={(value: number) => formatTime(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}