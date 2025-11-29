import React, { useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { BODY_AREAS, BRAND_BLUE } from '../constants';

interface OnboardingProps {
  initialGoal: number;
  onComplete: (areas: string[], goal: number) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ initialGoal, onComplete }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState(
    initialGoal !== undefined && initialGoal !== null
      ? initialGoal.toString()
      : '5'
  );

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAreas.length === 0) return;
    const parsed = parseInt(goalInput, 10);
    const safeGoal = Number.isNaN(parsed) || parsed <= 0 ? 5 : parsed;
    onComplete(selectedAreas, safeGoal);
  };

  const handleIncrement = () => {
    const current = parseInt(goalInput, 10) || 0;
    if (current < 20) {
      setGoalInput((current + 1).toString());
    }
  };

  const handleDecrement = () => {
    const current = parseInt(goalInput, 10) || 0;
    if (current > 1) {
      setGoalInput((current - 1).toString());
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-12 pb-8 flex flex-col max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          Step 1 of 2
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Build your <br/> Rehab Plan
        </h1>
        <p className="text-base text-gray-500 leading-relaxed">
          Tell us where sitting hurts the most and how many short sessions you want per day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        {/* Body areas card */}
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Problem Areas
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {BODY_AREAS.map((area) => {
              const active = selectedAreas.includes(area.id);
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleArea(area.id)}
                  className={`text-sm px-4 py-3 rounded-xl border text-left transition-all duration-200 flex justify-between items-center ${
                    active
                      ? 'bg-blue-50 text-blue-800 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">{area.label}</span>
                  {active && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily goal card */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            Daily Frequency
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            How many micro-sessions do you want per day?
          </p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 shadow-sm">
              <button
                type="button"
                onClick={handleDecrement}
                className="p-3 text-blue-500 hover:text-blue-600 active:opacity-40 transition-opacity"
              >
                <Minus size={20} />
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-12 text-center text-xl font-bold text-gray-900 border-none outline-none focus:ring-0 bg-transparent p-0"
              />
              <button
                type="button"
                onClick={handleIncrement}
                className="p-3 text-blue-500 hover:text-blue-600 active:opacity-40 transition-opacity"
              >
                <Plus size={20} />
              </button>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              sessions / day
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={selectedAreas.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-[0.98] shadow-lg ${
              selectedAreas.length === 0
                ? 'bg-blue-300 cursor-not-allowed opacity-70'
                : ''
            }`}
            style={{
              backgroundColor: selectedAreas.length === 0 ? undefined : BRAND_BLUE
            }}
          >
            Create Plan
          </button>
          {selectedAreas.length === 0 && (
            <p className="text-xs text-red-400 mt-3 text-center font-medium">
              Select at least one area to continue.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Onboarding;