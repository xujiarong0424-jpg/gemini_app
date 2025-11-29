import React, { useState, useEffect } from 'react';
import { User, ExternalLink } from 'lucide-react';
import { Session } from '../types';
import { BRAND_BLUE } from '../constants';

interface ProfileProps {
  displayName: string;
  avatarDataUrl: string | null;
  dailyGoal: number;
  sessions: Session[];
  onSaveProfile: (name: string, avatar: string | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ displayName, avatarDataUrl, dailyGoal, sessions, onSaveProfile }) => {
  const [nameInput, setNameInput] = useState(displayName || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarDataUrl || null);

  useEffect(() => {
    setNameInput(displayName || '');
    setAvatarPreview(avatarDataUrl || null);
  }, [displayName, avatarDataUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const trimmed = nameInput.trim();
    onSaveProfile(trimmed || 'Anonymous', avatarPreview || null);
  };

  const totalSessions = sessions.length;

  return (
    <div className="p-4 pt-10 space-y-6 pb-24">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center space-y-4">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-3xl font-bold text-blue-300">
              {nameInput ? nameInput.charAt(0).toUpperCase() : <User size={32}/>}
            </div>
          )}

          <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-700 transition-colors text-white">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <ExternalLink size={14} />
          </label>
        </div>

        <div className="w-full space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wide">
              Nickname
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
              placeholder="Enter your nickname"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 rounded-lg text-sm font-bold text-white active:scale-[0.98] shadow-sm"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Save Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">Daily Goal</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{dailyGoal}</p>
            <p className="text-xs text-gray-400">sessions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">Total Lifetime</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{totalSessions}</p>
            <p className="text-xs text-gray-400">completed</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;