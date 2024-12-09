import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Subject, TestResultFormData } from '../../types';

interface TestResultFormProps {
  subjects: Subject[];
  onSubmit: (data: TestResultFormData) => void;
  onCancel: () => void;
}

export default function TestResultForm({ subjects, onSubmit, onCancel }: TestResultFormProps) {
  const [date, setDate] = useState('');
  const [type, setType] = useState<'mock' | 'regular'>('regular');
  const [subjectScores, setSubjectScores] = useState(
    subjects.map(subject => ({
      subjectId: subject.id,
      maxScore: 100,
      score: 0
    }))
  );
  const [deviation, setDeviation] = useState('');
  const [schoolRank, setSchoolRank] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      type,
      subjects: subjectScores,
      deviation: deviation ? Number(deviation) : undefined,
      schoolRank: schoolRank || undefined
    });
  };

  const handleScoreChange = (index: number, field: 'maxScore' | 'score', value: string) => {
    const newScores = [...subjectScores];
    newScores[index] = {
      ...newScores[index],
      [field]: Number(value)
    };
    setSubjectScores(newScores);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">テスト結果を記録</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">テストの種類</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'mock' | 'regular')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="regular">定期テスト</option>
                <option value="mock">模擬試験</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">教科別の点数</label>
              {subjects.map((subject, index) => (
                <div key={subject.id} className="flex gap-4">
                  <div className="flex-none w-24">
                    <label className="block text-sm text-gray-600">{subject.name}</label>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <input
                      type="number"
                      value={subjectScores[index].maxScore}
                      onChange={(e) => handleScoreChange(index, 'maxScore', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="満点"
                      required
                    />
                    <span className="text-gray-500">/</span>
                    <input
                      type="number"
                      value={subjectScores[index].score}
                      onChange={(e) => handleScoreChange(index, 'score', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="得点"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {type === 'mock' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">偏差値</label>
                  <input
                    type="number"
                    value={deviation}
                    onChange={(e) => setDeviation(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="偏差値を入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">志望校判定</label>
                  <input
                    type="text"
                    value={schoolRank}
                    onChange={(e) => setSchoolRank(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="判定ランクを入力"
                  />
                </div>
              </>
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