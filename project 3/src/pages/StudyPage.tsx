import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, StopCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGoals } from '../hooks/useGoals';
import { StudySessionFormData } from '../types';

type TimerMode = 'manual' | 'stopwatch' | 'timer';

export default function StudyPage() {
  const { user } = useAuth();
  const { goals } = useGoals(user?.uid);
  const navigate = useNavigate();

  const [selectedGoal, setSelectedGoal] = useState('');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState(0);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [timerMode, setTimerMode] = useState<TimerMode>('manual');
  
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(30); // minutes
  const [remainingTime, setRemainingTime] = useState(timerDuration * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerMode === 'stopwatch' && isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerMode === 'timer' && isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timerMode, remainingTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: StudySessionFormData = {
      goalId: selectedGoal,
      startTime: startTime,
      duration: timerMode === 'manual' ? duration : 
               timerMode === 'stopwatch' ? Math.floor(elapsedTime / 60) :
               timerDuration - Math.floor(remainingTime / 60),
      amount: Number(amount),
      note: note || undefined
    };
    
    // TODO: Implement study session creation
    console.log(formData);
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">学習を記録</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            教材を選択
          </label>
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">教材を選択してください</option>
            {goals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開始時刻
          </label>
          <input
            type="datetime-local"
            value={startTime.toISOString().slice(0, 16)}
            onChange={(e) => setStartTime(new Date(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            時間の記録方法
          </label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setTimerMode('manual')}
              className={`flex-1 py-2 px-4 rounded-md ${
                timerMode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              手動入力
            </button>
            <button
              type="button"
              onClick={() => setTimerMode('stopwatch')}
              className={`flex-1 py-2 px-4 rounded-md ${
                timerMode === 'stopwatch'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              ストップウォッチ
            </button>
            <button
              type="button"
              onClick={() => setTimerMode('timer')}
              className={`flex-1 py-2 px-4 rounded-md ${
                timerMode === 'timer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              タイマー
            </button>
          </div>

          {timerMode === 'manual' && (
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="学習時間（分）"
              required
            />
          )}

          {timerMode === 'stopwatch' && (
            <div className="text-center space-y-4">
              <div className="text-4xl font-mono">{formatTime(elapsedTime)}</div>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-2 rounded-full bg-blue-600 text-white"
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  type="button"
                  onClick={() => setElapsedTime(0)}
                  className="p-2 rounded-full bg-gray-200"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {timerMode === 'timer' && (
            <div className="text-center space-y-4">
              {!isRunning && remainingTime === timerDuration * 60 && (
                <input
                  type="number"
                  value={timerDuration}
                  onChange={(e) => {
                    setTimerDuration(Number(e.target.value));
                    setRemainingTime(Number(e.target.value) * 60);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="タイマー時間（分）"
                />
              )}
              <div className="text-4xl font-mono">{formatTime(remainingTime)}</div>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-2 rounded-full bg-blue-600 text-white"
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRunning(false);
                    setRemainingTime(timerDuration * 60);
                  }}
                  className="p-2 rounded-full bg-gray-200"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学習量
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="例: 5ページ, 1-15問"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモ
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="学習の要点やひとことメモ"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          記録を保存
        </button>
      </form>
    </div>
  );
}