import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Home as HomeIcon,
  Dumbbell,
  BarChart2,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';

// Firebase imports removed to fix missing module errors. 
// App is now using LocalStorage exclusively.
import { auth, db } from './services/firebase';

import { Plan, Session } from './types';
import { ACTIVE_WINDOW_SECONDS, MINUTE, mockPlans, AREA_PLAN_MAP } from './constants';

// Components
import Home from './components/Home';
import Training from './components/Training';
import ExercisesLibrary from './components/ExercisesLibrary';
import Stats from './components/Stats';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import PostureSetupModal from './components/PostureSetupModal';

const App = () => {
  const [view, setView] = useState('Home');
  const [sitTimeSeconds, setSitTimeSeconds] = useState(0);
  const [sitAlertOpen, setSitAlertOpen] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  // Relaxed type for user since we are mocking auth
  const [user, setUser] = useState<any | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [postureAreas, setPostureAreas] = useState<string[]>([]);
  const [showPostureModal, setShowPostureModal] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  const [reminderIntervalSeconds, setReminderIntervalSeconds] = useState(() => {
    const defaultGoal = 5;
    return defaultGoal > 0
      ? Math.round(ACTIVE_WINDOW_SECONDS / defaultGoal)
      : 25 * MINUTE;
  });

  const remainingSeconds = Math.max(0, reminderIntervalSeconds - sitTimeSeconds);

  // --- Auth Initialization (LocalStorage Fallback) ---
  useEffect(() => {
    // Fallback: Simulate Auth for Demo purposes
    console.log('Using Local Storage fallback (Firebase disabled).');
    setTimeout(() => {
      setUser({ uid: 'local-guest-user' });
      setAuthInitialized(true);
    }, 500);
  }, []);

  // --- Data Fetching (LocalStorage Fallback) ---
  useEffect(() => {
    if (!user) return;

    // LocalStorage Fallback Logic
    const storedGoal = localStorage.getItem('rehab_goal');
    if (storedGoal) setDailyGoal(parseInt(storedGoal, 10));

    const storedProfile = localStorage.getItem('rehab_profile');
    if (storedProfile) {
      const p = JSON.parse(storedProfile);
      setDisplayName(p.displayName || '');
      setAvatarDataUrl(p.avatarDataUrl || null);
    }

    const storedPosture = localStorage.getItem('rehab_posture');
    if (storedPosture) setPostureAreas(JSON.parse(storedPosture));

    const storedSessions = localStorage.getItem('rehab_sessions');
    if (storedSessions) {
      const s = JSON.parse(storedSessions).map((sess: any) => ({
        ...sess,
        date: new Date(sess.date)
      }));
      setSessions(s);
    }
  }, [user]);

  // --- Logic & Handlers (LocalStorage Fallback) ---

  const handleUpdateGoal = useCallback(async (newGoal: number) => {
    setDailyGoal(newGoal);
    localStorage.setItem('rehab_goal', newGoal.toString());
  }, []);

  const handleSaveProfile = useCallback(async (newName: string, newAvatar: string | null) => {
    setDisplayName(newName);
    setAvatarDataUrl(newAvatar);
    localStorage.setItem('rehab_profile', JSON.stringify({ displayName: newName, avatarDataUrl: newAvatar }));
  }, []);

  const handleSavePostureAreas = useCallback(async (areas: string[]) => {
    setPostureAreas(areas);
    localStorage.setItem('rehab_posture', JSON.stringify(areas));
  }, []);

  const handleClearData = useCallback(async () => {
    setSessions([]);
    localStorage.removeItem('rehab_sessions');
  }, []);

  const handleStartTraining = useCallback((plan: Plan) => {
    setCurrentPlan(plan);
    setView('Training');
    setSitAlertOpen(false);
  }, []);

  const handleCancelWorkout = useCallback(() => {
    setCurrentPlan(null);
    setView('Home');
    setSitAlertOpen(false);
  }, []);

  const handleFinishWorkout = useCallback(async (plan: Plan) => {
    if (!user) return;

    const newSession = {
      plan: plan,
      date: new Date(),
      userId: user.uid,
      id: Math.random().toString(36).substr(2, 9) // temp id for local
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('rehab_sessions', JSON.stringify(updatedSessions));

    setSitTimeSeconds(0);
    setSitAlertOpen(false);
    setView('Home');
  }, [user, sessions]);

  // Recalculate interval based on activity
  const recalcNextReminderInterval = useCallback(() => {
    const now = new Date();
    const activeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    const activeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0);
    const totalActiveSeconds = (activeEnd.getTime() - activeStart.getTime()) / 1000;

    let effectiveNow = now.getTime();
    if (effectiveNow < activeStart.getTime()) effectiveNow = activeStart.getTime();
    else if (effectiveNow > activeEnd.getTime()) {
      setReminderIntervalSeconds(25 * MINUTE);
      return;
    }

    const elapsedSeconds = (effectiveNow - activeStart.getTime()) / 1000;
    const todayStr = now.toDateString();
    const completedToday = sessions.filter(s => s.date.toDateString() === todayStr).length;

    const remainingSessions = Math.max(dailyGoal - completedToday, 1);
    const remainingSecondsInWindow = Math.max(totalActiveSeconds - elapsedSeconds, MINUTE);

    const nextInterval = Math.round(remainingSecondsInWindow / remainingSessions);
    setReminderIntervalSeconds(nextInterval);
  }, [dailyGoal, sessions]);

  const handleCompleteOnboarding = useCallback((areas: string[], goal: number) => {
    handleSavePostureAreas(areas);
    handleUpdateGoal(goal);
  }, [handleSavePostureAreas, handleUpdateGoal]);

  useEffect(() => {
    if (user) {
      recalcNextReminderInterval();
    }
  }, [recalcNextReminderInterval, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSitTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sitTimeSeconds >= reminderIntervalSeconds && currentPlan === null) {
      setSitAlertOpen(true);
    }
  }, [sitTimeSeconds, reminderIntervalSeconds, currentPlan]);

  const getRecommendedPlan = () => {
    if (!postureAreas || postureAreas.length === 0) {
      return mockPlans.reduce((max, plan) => (plan.actions > max.actions ? plan : max), mockPlans[0]);
    }
    const firstArea = postureAreas[0];
    const mappedIds = AREA_PLAN_MAP[firstArea];
    if (!mappedIds || mappedIds.length === 0) {
      return mockPlans.reduce((max, plan) => (plan.actions > max.actions ? plan : max), mockPlans[0]);
    }
    const match = mockPlans.find((p) => mappedIds.includes(p.id));
    return match || mockPlans[0];
  };

  const recommendedPlan = getRecommendedPlan();

  const navItems = [
    { name: 'Home', icon: HomeIcon, view: 'Home' },
    { name: 'Exercises', icon: Dumbbell, view: 'Exercises' },
    { name: 'Stats', icon: BarChart2, view: 'Stats' },
    { name: 'Profile', icon: User, view: 'Profile' },
    { name: 'Settings', icon: SettingsIcon, view: 'Settings' },
  ];

  const hasCompletedOnboarding = postureAreas && postureAreas.length > 0;

  const renderContent = () => {
    if (!authInitialized) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
          <Activity size={48} className="animate-spin mb-4 text-blue-500" />
          <p className="text-lg font-semibold animate-pulse">Initializing Rehab App...</p>
        </div>
      );
    }

    if (!hasCompletedOnboarding) {
      return (
        <Onboarding
          initialGoal={dailyGoal}
          onComplete={handleCompleteOnboarding}
        />
      );
    }

    switch (view) {
      case 'Home':
        return (
          <Home
            sitTimeSeconds={sitTimeSeconds}
            sitAlertOpen={sitAlertOpen}
            remainingSeconds={remainingSeconds}
            reminderIntervalSeconds={reminderIntervalSeconds}
            dailyGoal={dailyGoal}
            sessions={sessions}
            onStartTraining={handleStartTraining}
            recommendedPlan={recommendedPlan}
            postureAreas={postureAreas}
            onOpenPostureSetup={() => setShowPostureModal(true)}
          />
        );
      case 'Training':
        return (
          <Training
            plan={currentPlan!}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
          />
        );
      case 'Exercises':
        return <ExercisesLibrary onStartTraining={handleStartTraining} />;
      case 'Profile':
        return (
          <Profile
            displayName={displayName}
            avatarDataUrl={avatarDataUrl}
            dailyGoal={dailyGoal}
            sessions={sessions}
            onSaveProfile={handleSaveProfile}
          />
        );
      case 'Stats':
        return (
          <Stats
            sessions={sessions}
            dailyGoal={dailyGoal}
            onClearData={handleClearData}
          />
        );
      case 'Settings':
        return (
          <Settings
            dailyGoal={dailyGoal}
            onUpdateGoal={handleUpdateGoal}
            onClearData={handleClearData}
            userId={user ? user.uid : 'Guest'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="flex-grow max-w-lg mx-auto w-full relative">
        {renderContent()}

        <PostureSetupModal
          isOpen={showPostureModal && hasCompletedOnboarding}
          selectedAreas={postureAreas}
          onClose={() => setShowPostureModal(false)}
          onSave={handleSavePostureAreas}
        />
      </div>

      {hasCompletedOnboarding && view !== 'Training' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40 pb-safe">
          <nav className="flex justify-around max-w-lg mx-auto p-1 pb-3 pt-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setView(item.view)}
                className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-200 flex-1 relative ${
                  view === item.view
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={24} strokeWidth={view === item.view ? 2.5 : 2} className="mb-1 transition-transform duration-200" style={{ transform: view === item.view ? 'translateY(-2px)' : 'none'}}/>
                <span className={`text-[10px] font-bold ${view === item.view ? 'opacity-100' : 'opacity-80'}`}>{item.name}</span>
                {view === item.view && <div className="absolute -bottom-3 w-1 h-1 bg-blue-600 rounded-full mb-4"></div>}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default App;