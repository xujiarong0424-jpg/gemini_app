import React from 'react';
import { Clock, AlertTriangle, Dumbbell, Calendar, ChevronRight } from 'lucide-react';
import { Plan, Session } from '../types';
import { formatTime, BRAND_BLUE, WARNING_RED, SUCCESS_GREEN, mockPlans, BODY_AREAS, MINUTE } from '../constants';

interface HomeProps {
  sitTimeSeconds: number;
  sitAlertOpen: boolean;
  remainingSeconds: number;
  reminderIntervalSeconds: number;
  dailyGoal: number;
  sessions: Session[];
  onStartTraining: (plan: Plan) => void;
  recommendedPlan: Plan;
  postureAreas: string[];
  onOpenPostureSetup: () => void;
}

const Home: React.FC<HomeProps> = ({
  sitTimeSeconds,
  sitAlertOpen,
  remainingSeconds,
  reminderIntervalSeconds,
  dailyGoal,
  sessions,
  onStartTraining,
  recommendedPlan,
  postureAreas,
  onOpenPostureSetup,
}) => {
  const completedToday = sessions.filter(
    s => s.date.toDateString() === new Date().toDateString()
  ).length;
  const targetRemaining = Math.max(0, dailyGoal - completedToday);
  const progressPercent = Math.min(100, (completedToday / dailyGoal) * 100);

  const hasPersonalizedPlan = postureAreas && postureAreas.length > 0;
  const selectedLabels = hasPersonalizedPlan
    ? BODY_AREAS.filter((a) => postureAreas.includes(a.id)).map((a) => a.label)
    : [];

  const minutesInterval = Math.max(
    1,
    Math.round(reminderIntervalSeconds / MINUTE)
  );

  return (
    <div className="p-4 flex flex-col space-y-4 pb-24">
      <div className="flex justify-between items-end mt-6 mb-2">
        <h1 className="text-4xl font-extrabold text-gray-900">
          My Rehab
        </h1>
        <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
             <Clock size={12} className="mr-1"/> 
             Monitor Active
        </div>
      </div>

      {/* Top: Next session / timer card */}
      <div
        className={`p-6 rounded-2xl shadow-lg transition-all duration-300 border relative overflow-hidden ${
          sitAlertOpen
            ? 'text-white border-red-500 animate-pulse'
            : 'bg-white text-gray-800 border-gray-100'
        }`}
        style={{ backgroundColor: sitAlertOpen ? WARNING_RED : '#ffffff' }}
      >
        <div className="flex justify-between items-center relative z-10">
          <h2
            className={`text-lg font-bold flex items-center ${
              sitAlertOpen ? 'text-white' : 'text-gray-800'
            }`}
          >
            {sitAlertOpen ? 'Time to Move!' : 'Sitting Timer'}
          </h2>
          {sitAlertOpen && (
            <div className="flex items-center text-sm font-semibold text-white bg-white/20 px-2 py-1 rounded-md">
              <AlertTriangle size={16} className="mr-1" />
              Action Required
            </div>
          )}
        </div>

        {!sitAlertOpen && (
          <>
            <p className="text-5xl font-extrabold mt-4 tracking-tight text-gray-900 tabular-nums">
              {formatTime(sitTimeSeconds)}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                 <span>Current Session</span>
                 <span>Goal: {minutesInterval}m</span>
            </div>
             <div className="w-full bg-gray-100 h-1.5 mt-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-1000" style={{width: `${Math.min(100, (sitTimeSeconds / reminderIntervalSeconds) * 100)}%`}} />
            </div>
            <p className="text-xs mt-2 opacity-80 text-gray-500">
              Next reminder in {formatTime(remainingSeconds)}
            </p>
          </>
        )}

        {sitAlertOpen && (
          <>
            <p className="text-3xl font-extrabold mt-3 tracking-tight text-white tabular-nums">
              {formatTime(sitTimeSeconds)} Sitting
            </p>
            <p className="text-sm mt-1 opacity-90 text-white">
              You've been sitting for a while. Do your next rehab micro-workout now.
            </p>
            <button
              onClick={() => onStartTraining(recommendedPlan)}
              className="w-full py-3 mt-4 rounded-xl font-bold text-lg bg-white text-red-600 hover:bg-gray-50 transition-colors active:scale-[0.98] shadow-lg flex items-center justify-center"
            >
                Start Session <ChevronRight size={20} className="ml-1" />
            </button>
          </>
        )}
      </div>

      {/* Today plan card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Dumbbell size={20} className="mr-2 text-blue-500" />
            Today's Focus
          </h2>
          {hasPersonalizedPlan && (
            <button
              onClick={onOpenPostureSetup}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md"
            >
              Edit
            </button>
          )}
        </div>

        {hasPersonalizedPlan ? (
          <>
            <div className="mb-4">
                 <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Target Areas</p>
                <div className="flex flex-wrap gap-2">
                {selectedLabels.map((label) => (
                    <span
                    key={label}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                    >
                    {label}
                    </span>
                ))}
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Recommended:</p>
                <p className="text-lg font-bold text-gray-900">{recommendedPlan.name}</p>
                <p className="text-xs text-gray-500 mb-3">
                {recommendedPlan.actions} actions · {recommendedPlan.intensity} intensity
                </p>
                <button
                onClick={() => onStartTraining(recommendedPlan)}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white active:scale-[0.98] shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: BRAND_BLUE }}
                >
                Start Recommended
                </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Tell us which body areas feel stiff or painful from sitting. We'll build a rehab micro-workout plan for you.
            </p>
            <button
              onClick={onOpenPostureSetup}
              className="w-full py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              Set up my plan
            </button>
          </>
        )}
      </div>

      {/* Daily goal progress */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-500" />
            Daily Progress
            </h2>
             <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {Math.round(progressPercent)}%
             </span>
        </div>
        
        <p className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
          {completedToday} <span className="text-lg text-gray-400 font-normal">/ {dailyGoal} Sessions</span>
        </p>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500 ease-out"
            style={{
              backgroundColor: completedToday >= dailyGoal ? SUCCESS_GREEN : BRAND_BLUE,
              width: `${progressPercent}%`
            }}
          ></div>
        </div>
        <p className="text-sm mt-3 text-gray-600">
          {targetRemaining > 0
            ? `Only ${targetRemaining} more session${targetRemaining !== 1 ? 's' : ''} to hit your goal.`
            : 'Goal achieved! Keep up the great work.'}
        </p>
      </div>

      {/* Quick Start Plans */}
      <h2 className="text-xl font-bold text-gray-800 mt-2 px-1">
        Quick Library
      </h2>
      <div className="space-y-3">
        {mockPlans.map(plan => (
          <button
            key={plan.id}
            onClick={() => onStartTraining(plan)}
            className={`flex justify-between items-center w-full p-4 rounded-xl text-left font-semibold transition-transform duration-150 active:scale-[0.98] shadow-sm border ${
              plan.id === recommendedPlan.id
                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-100'
            }`}
          >
            <div>
              <span className={`text-base block ${plan.id === recommendedPlan.id ? 'text-blue-900' : 'text-gray-900'}`}>{plan.name}</span>
              <p
                className={`text-xs mt-0.5 ${
                  plan.id === recommendedPlan.id ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {plan.actions} Actions · {plan.intensity} Intensity
              </p>
            </div>
            <div className={`p-2 rounded-full ${plan.id === recommendedPlan.id ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;