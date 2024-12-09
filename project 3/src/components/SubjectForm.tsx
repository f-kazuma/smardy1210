import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { SubjectFormData } from '../types';

interface SubjectFormProps {
  onSubmit: (subject: SubjectFormData) => void;
}

export default function SubjectForm({ onSubmit }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetScore, setTargetScore] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || undefined,
      targetScore: targetScore ? Number(targetScore) : undefined,
    });
    setName('');
    setDescription('');
    setTargetScore('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">新しい教科を登録</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">教科名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="例: 数学"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">説明（任意）</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="例: 大学入学共通テスト対策"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">目標点数（任意）</label>
        <input
          type="number"
          value={targetScore}
          onChange={(e) => setTargetScore(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="例: 90"
          min="0"
          max="100"
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        教科を追加
      </button>
    </form>
  );
}