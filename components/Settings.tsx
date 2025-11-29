import React, { useState } from 'react';
import { Trash2, XCircle, Minus, Plus } from 'lucide-react';
import { BRAND_BLUE, WARNING_RED } from '../constants';

interface SettingsProps {
  dailyGoal: number;
  onUpdateGoal: (goal: number) => void;
  onClearData: () => void;
  userId: string;
}

const Settings: React.FC<SettingsProps> = ({ dailyGoal, onUpdateGoal, onClearData, userId }) => {
  const initialGoal = dailyGoal !== undefined && dailyGoal !== null ? dailyGoal : 5;
  const [newGoal, setNewGoal] = useState(initialGoal.toString());
  const [showClearModal, setShowClearModal] = useState(false);

  const handleSave = () => {
    const goal = parseInt(newGoal, 10);
    if (goal > 0) {
      onUpdateGoal(goal);
    }
  };

  const handleConfirmClear = () => {
    onClearData();
    setShowClearModal(false);
  };

  const handleIncrement = () => {
    const current = parseInt(newGoal, 10) || 0;
    setNewGoal((current + 1).toString());
  };

  const handleDecrement = () => {
    const current = parseInt(newGoal, 10) || 0;
    if (current > 1) {
      setNewGoal((current - 1).toString());
    }
  };

  return (
    <div className="p-4 pt-10 space-y-6 pb-24">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Settings
      </h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">User Account</h2>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium text-gray-700">User ID</span>
            <span className="font-mono bg-gray-100 p-2 rounded text-xs break-all max-w-[60%] text-right text-gray-500">
              {userId}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Daily Session Goal</h2>
        </div>
        <div className="p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Sessions per day
          </label>
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 flex-1 shadow-sm">
                <button
                  onClick={handleDecrement}
                  className="p-3 text-blue-500 hover:text-blue-600 active:opacity-40 transition-opacity"
                >
                  <Minus size={20} />
                </button>
                <input
                    type="number"
                    min="1"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="flex-1 p-2 text-center text-xl font-bold text-gray-900 border-none outline-none focus:ring-0 bg-transparent"
                />
                <button
                  onClick={handleIncrement}
                  className="p-3 text-blue-500 hover:text-blue-600 active:opacity-40 transition-opacity"
                >
                  <Plus size={20} />
                </button>
             </div>
            <button
                onClick={handleSave}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-colors active:scale-[0.98] shadow-sm"
                style={{ backgroundColor: BRAND_BLUE }}
            >
                Save
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4">
          <button
            onClick={() => setShowClearModal(true)}
            className="w-full py-3 rounded-lg font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors active:scale-[0.98] flex items-center justify-center border border-red-100"
          >
            <Trash2 size={18} className="mr-2" />
            Clear All History
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            (This action is irreversible and will delete all logged sessions for this user.)
          </p>
        </div>
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                 <XCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete ALL workout history?
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: WARNING_RED }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;