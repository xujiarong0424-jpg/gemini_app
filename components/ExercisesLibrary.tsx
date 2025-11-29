import React from 'react';
import { Plan } from '../types';
import { mockWorkoutContent, BRAND_BLUE } from '../constants';

interface ExercisesLibraryProps {
  onStartTraining: (plan: Plan) => void;
}

const ExercisesLibrary: React.FC<ExercisesLibraryProps> = ({ onStartTraining }) => {
  return (
    <div className="p-4 pt-10 space-y-4 pb-24">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Library
      </h1>
      <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
        Choose any single exercise for a focused 30-second practice. Perfect for quick relief.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {mockWorkoutContent.map((exercise, index) => {
          const plan: Plan = {
            id: `exercise-${index}`,
            name: exercise.name,
            actions: 1,
            intensity: 'Low',
            exercises: [exercise],
          };

          return (
            <div
              key={exercise.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="mr-3 mb-3 sm:mb-0">
                <h2 className="text-base font-bold text-gray-900">
                  {exercise.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {exercise.description}
                </p>
              </div>
              <button
                onClick={() => onStartTraining(plan)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white active:scale-[0.98] self-start sm:self-auto shrink-0"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                Start 30s
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExercisesLibrary;