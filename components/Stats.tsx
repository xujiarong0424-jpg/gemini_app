import React from 'react';
import ActivityCalendar from './ActivityCalendar';
import SessionHistory from './SessionHistory';
import { Session } from '../types';

interface StatsProps {
  sessions: Session[];
  dailyGoal: number;
  onClearData: () => void;
}

const Stats: React.FC<StatsProps> = ({ sessions, dailyGoal, onClearData }) => {
  return (
    <div className="p-4 pt-10 pb-24">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Activity Stats
      </h1>

      <ActivityCalendar sessions={sessions} dailyGoal={dailyGoal} />

      <h2 className="text-xl font-bold text-gray-800 mb-3 px-1">
        Recent History
      </h2>
      <SessionHistory sessions={sessions} onClearData={onClearData} />
    </div>
  );
};

export default Stats;