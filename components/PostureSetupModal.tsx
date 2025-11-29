import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { BODY_AREAS, BRAND_BLUE } from '../constants';

interface PostureSetupModalProps {
  isOpen: boolean;
  selectedAreas: string[];
  onClose: () => void;
  onSave: (areas: string[]) => void;
}

const PostureSetupModal: React.FC<PostureSetupModalProps> = ({ isOpen, selectedAreas, onClose, onSave }) => {
  const [localAreas, setLocalAreas] = useState<string[]>([]);

  useEffect(() => {
    setLocalAreas(selectedAreas && selectedAreas.length > 0 ? selectedAreas : []);
  }, [selectedAreas]);

  if (!isOpen) return null;

  const toggleArea = (id: string) => {
    setLocalAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localAreas.length === 0) return;
    onSave(localAreas);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-end justify-center z-50 sm:items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg mx-auto p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Adjust your Plan
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Update the areas most affected by long sitting. We'll fine-tune your micro-workouts instantly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {BODY_AREAS.map((area) => {
              const active = localAreas.includes(area.id);
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleArea(area.id)}
                  className={`text-sm px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {area.label}
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white transition-colors active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: BRAND_BLUE }}
            disabled={localAreas.length === 0}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostureSetupModal;