import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PlusCircle } from 'lucide-react';
import EventForm from '../components/schedule/EventForm';
import { EventFormData } from '../types';

export default function SchedulePage() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setShowEventForm(true);
  };

  const handleEventSubmit = (data: EventFormData) => {
    console.log(data);
    setShowEventForm(false);
  };

  // Dummy events for demonstration
  const events = [
    {
      title: '模擬試験',
      date: '2024-03-15',
      backgroundColor: '#3B82F6',
    },
    {
      title: '英語中間テスト',
      date: '2024-03-20',
      backgroundColor: '#10B981',
    },
    {
      title: '数学教材完了予定',
      date: '2024-03-25',
      backgroundColor: '#F59E0B',
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">スケジュール</h1>
        <button
          onClick={() => setShowEventForm(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          予定を追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ja"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          events={events}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>

      {showEventForm && (
        <EventForm
          initialDate={selectedDate}
          onSubmit={handleEventSubmit}
          onCancel={() => setShowEventForm(false)}
        />
      )}
    </div>
  );
}