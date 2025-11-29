import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check } from 'lucide-react';
import { Plan, Exercise } from '../types';
import { mockWorkoutContent, SESSION_DURATION_SECONDS, BRAND_BLUE, SUCCESS_GREEN, formatTime } from '../constants';

interface TrainingProps {
  plan: Plan;
  onFinishWorkout: (plan: Plan) => void;
  onCancelWorkout: () => void;
}

const Training: React.FC<TrainingProps> = ({ plan, onFinishWorkout, onCancelWorkout }) => {
  const workoutContent: Exercise[] =
    plan.exercises && Array.isArray(plan.exercises) && plan.exercises.length > 0
      ? plan.exercises
      : mockWorkoutContent.slice(0, plan.actions);

  const totalActions = workoutContent.length;

  const [actionIndex, setActionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(SESSION_DURATION_SECONDS);
  const [isComplete, setIsComplete] = useState(false);

  const currentAction = workoutContent[actionIndex];
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;

    // Use window.setInterval to ensure return type is number (not NodeJS.Timeout)
    timerRef.current = window.setInterval(() => {
      setSessionTime((prevTime) => {
        if (prevTime <= 1) {
          let finishedAll = false;

          setActionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= totalActions) {
              finishedAll = true;
              return prevIndex;
            }
            return nextIndex;
          });

          if (finishedAll) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsComplete(true);
            return 0;
          }

          return SESSION_DURATION_SECONDS;
        }

        return prevTime - 1;
      });
    }, 1000);
  }, [totalActions]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTimer]);

  const sessionProgress =
    SESSION_DURATION_SECONDS > 0
      ? (SESSION_DURATION_SECONDS - sessionTime) / SESSION_DURATION_SECONDS
      : 0;

  const handleFinishClick = () => {
    onFinishWorkout(plan);
  };

  return (
    <div className="p-4 flex flex-col h-full pt-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        {plan.name}
      </h1>
      <p className="text-sm text-gray-500 mb-6 font-semibold">
        Action {Math.min(actionIndex + 1, totalActions)} of {totalActions}
      </p>

      <div className="flex-grow flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-xl border border-gray-100 mb-6 relative overflow-hidden">
        {/* Progress Background Effect */}
         <div 
            className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((actionIndex) / totalActions) * 100}%` }}
         />

        <h2 className="text-6xl font-extrabold text-gray-800 mb-4 tracking-tighter tabular-nums">
          {formatTime(sessionTime)}
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${sessionProgress * 100}%`, backgroundColor: BRAND_BLUE }}
          ></div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
          {currentAction?.name || 'Workout Complete'}
        </h3>
        <p className="text-base text-gray-600 text-center">
          {currentAction?.description ||
            "Awesome work! Tap below to log your session and reset the timer."}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleFinishClick}
          className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-150 active:scale-[0.98] shadow-md flex items-center justify-center hover:opacity-90"
          style={{ backgroundColor: SUCCESS_GREEN }}
        >
          <Check size={20} className="mr-2" />
          {isComplete ? 'Log Session & Home' : 'Finish & Log Workout Early'}
        </button>

        <button
          onClick={onCancelWorkout}
          className="w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-[0.98] shadow-sm"
        >
          Cancel Workout
        </button>
      </div>

      {isComplete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center">
             <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <Check size={32} strokeWidth={3} />
             </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Great Job!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              You finished your micro-workout. We'll reset your sitting timer and plan your next alert.
            </p>
            <button
              onClick={handleFinishClick}
              className="w-full py-3 rounded-xl font-bold text-white transition-colors active:scale-95 shadow-lg"
              style={{ backgroundColor: SUCCESS_GREEN }}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;