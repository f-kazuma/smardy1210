import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, LineChart, Calendar } from 'lucide-react';

export default function Footer() {
  const navItems = [
    { to: '/', icon: Home, label: 'ホーム' },
    { to: '/materials', icon: BookOpen, label: '教材' },
    { to: '/records', icon: LineChart, label: '記録' },
    { to: '/schedule', icon: Calendar, label: 'スケジュール' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="max-w-lg mx-auto px-4">
        <ul className="flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center p-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}