import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EventFormData } from '../../types';

interface EventFormProps {
  initialDate?: string;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export default function EventForm({ initialDate, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate || '');
  const [type, setType] = useState<'exam' | 'test' | 'deadline' | 'goal'>('test');
  const [description, setDescription] = useState('');
  const [targetScore, setTargetScore] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      date,
      type,
      description: description || undefined,
      targetScore: targetScore ? Number(targetScore) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">予定を追加</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">種類</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'exam' | 'test' | 'deadline' | 'goal')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="exam">入試</option>
                <option value="test">テスト</option>
                <option value="deadline">締切</option>
                <option value="goal">目標</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">説明</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {(type === 'exam' || type === 'test' || type === 'goal') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">目標点数</label>
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}