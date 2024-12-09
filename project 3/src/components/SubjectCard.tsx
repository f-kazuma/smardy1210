import React, { useState } from 'react';
import { Book, Edit2, Trash2, X, Check } from 'lucide-react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
  onEdit: (subject: Subject) => void;
}

export default function SubjectCard({ subject, onDelete, onEdit }: SubjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(subject.name);
  const [editedDescription, setEditedDescription] = useState(subject.description || '');
  const [editedTargetScore, setEditedTargetScore] = useState(
    subject.targetScore !== undefined ? String(subject.targetScore) : ''
  );

  const handleEdit = () => {
    if (isEditing) {
      onEdit({
        ...subject,
        name: editedName,
        description: editedDescription || undefined,
        targetScore: editedTargetScore ? Number(editedTargetScore) : undefined,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedName(subject.name);
    setEditedDescription(subject.description || '');
    setEditedTargetScore(subject.targetScore !== undefined ? String(subject.targetScore) : '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3 flex-grow">
          <Book className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          {isEditing ? (
            <div className="flex-grow space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">教科名</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">説明（任意）</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">目標点数（任意）</label>
                <input
                  type="number"
                  value={editedTargetScore}
                  onChange={(e) => setEditedTargetScore(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
              {subject.description && (
                <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
              )}
              {subject.targetScore !== undefined && (
                <p className="text-sm text-gray-600 mt-1">目標点数: {subject.targetScore}点</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-green-600 hover:text-green-700"
                disabled={!editedName}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(subject.id)}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}