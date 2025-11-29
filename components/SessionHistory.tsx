import React from 'react';
import { Session } from '../types';
import { getPlanTotalSeconds, formatTime } from '../constants';

interface SessionHistoryProps {
  sessions: Session[];
  onClearData: () => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, onClearData }) => {
  const groupedSessions = sessions.reduce((acc, session) => {
    const dateKey = session.date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  const sortedDates = Object.keys(groupedSessions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <div className="p-4 pt-4 space-y-4">
      {sessions.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-md border border-gray-100 border-dashed">
          <p className="text-gray-500 font-semibold">No workout sessions logged yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Start a session to see your progress here!
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Lifetime Sessions</span>
            <span className="text-2xl font-extrabold text-blue-600">
              {sessions.length}
            </span>
          </div>

          <div className="space-y-4">
            {sortedDates.map(dateKey => (
              <div
                key={dateKey}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    {dateKey}
                  </h2>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                  >
                    {groupedSessions[dateKey].length} Session
                    {groupedSessions[dateKey].length !== 1 ? 's' : ''}
                  </span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {groupedSessions[dateKey].map((session, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-gray-700 text-sm py-3 px-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 flex items-center">
                         <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        {session.plan.name}
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {session.date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        <br />
                        <span className='font-semibold text-gray-400'>
                          {formatTime(getPlanTotalSeconds(session.plan))}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SessionHistory;