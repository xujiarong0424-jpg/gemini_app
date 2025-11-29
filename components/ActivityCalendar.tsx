import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Session } from '../types';
import { SUCCESS_GREEN } from '../constants';

interface ActivityCalendarProps {
  sessions: Session[];
  dailyGoal: number;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ sessions, dailyGoal }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionsPerDay = sessions.reduce((acc, session) => {
    const d = session.date;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getDayKey = (day: number) => `${year}-${month + 1}-${day}`;

  const renderDays = () => {
    const dayCells = [];
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    dayCells.push(
      ...daysOfWeek.map(day => (
        <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
          {day}
        </div>
      ))
    );

    for (let i = 0; i < firstDayOfMonth; i++) {
      dayCells.push(<div key={`blank-${i}`} className="p-1"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      const key = getDayKey(day);
      const count = sessionsPerDay[key] || 0;

      const progress =
        dailyGoal > 0 ? Math.min(count / dailyGoal, 1) : 0;
      const angle = progress * 360;

      const ringBg = '#f3f4f6'; // gray-100
      const ringFill = SUCCESS_GREEN;

      const outerStyle =
        progress > 0
          ? {
              backgroundImage: `conic-gradient(${ringFill} 0deg ${angle}deg, ${ringBg} ${angle}deg 360deg)`,
            }
          : { backgroundColor: ringBg };

      const goalReached = progress >= 1;

      const innerBgClass = goalReached ? 'bg-green-500' : 'bg-white';
      const innerTextClass = goalReached ? 'text-white' : 'text-gray-700';
      const todayClass = isToday ? 'ring-2 ring-blue-500 ring-offset-1' : '';

      dayCells.push(
        <div key={day} className="p-1 flex justify-center items-center aspect-square">
          <div
            className={`w-8 h-8 rounded-full p-[3px] flex items-center justify-center ${todayClass}`}
            style={outerStyle}
          >
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-xs transition-all duration-150 ${innerBgClass} ${innerTextClass} ${isToday ? 'font-bold' : ''}`}
            >
              {day}
            </div>
          </div>
        </div>
      );
    }

    return dayCells;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formattedMonth = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {formattedMonth}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default ActivityCalendar;