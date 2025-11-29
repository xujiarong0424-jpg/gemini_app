import { Plan, Exercise, BodyArea } from './types';

export const MINUTE = 60;
export const SESSION_DURATION_SECONDS = 30; // 30 seconds per exercise action
export const WARNING_RED = '#ff3b30'; // iOS System Red
export const SUCCESS_GREEN = '#34c759'; // iOS System Green
export const BRAND_BLUE = '#007aff'; // iOS System Blue

export const ACTIVE_WINDOW_SECONDS = 12 * 60 * 60; // 12-hour active window (e.g., 9am-9pm)

export const mockPlans: Plan[] = [
  { id: '1', name: 'Desk Stretch', actions: 4, intensity: 'Low' },
  { id: '2', name: 'Core Activation', actions: 6, intensity: 'Medium' },
  { id: '3', name: 'Upper Body Blast', actions: 8, intensity: 'High' },
];

export const mockWorkoutContent: Exercise[] = [
  { name: 'Neck Rotations', description: 'Gently rotate your head clockwise and counter-clockwise.' },
  { name: 'Shoulder Rolls', description: 'Roll your shoulders back and down, then forward and up.' },
  { name: 'Tricep Stretch', description: 'Reach hand behind head, gently pull elbow.' },
  { name: 'Torso Twist', description: 'Twist your upper body side to side while sitting tall.' },
  { name: 'Air Squats', description: 'Perform shallow squats while standing.' },
  { name: 'Standing Side Bend', description: 'Reach one arm overhead and stretch to the opposite side.' },
  { name: 'Wall Push-ups', description: 'Perform light push-ups with hands placed on a wall.' },
  { name: 'Calf Raises', description: 'Stand up and raise your heels.' },
];

export const BODY_AREAS: BodyArea[] = [
  { id: 'neck', label: 'Neck & Shoulders' },
  { id: 'upper_back', label: 'Upper Back' },
  { id: 'lower_back', label: 'Lower Back & Core' },
  { id: 'hips', label: 'Hips & Hip Flexors' },
  { id: 'wrists', label: 'Wrists & Forearms' },
];

export const AREA_PLAN_MAP: Record<string, string[]> = {
  neck: ['1', '3'],
  upper_back: ['3'],
  lower_back: ['2'],
  hips: ['2'],
  wrists: ['1'],
};

export const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getPlanTotalSeconds = (plan: Plan) => {
  if (!plan) return 0;
  const actionCount =
    Array.isArray(plan.exercises) && plan.exercises.length > 0
      ? plan.exercises.length
      : plan.actions;
  return actionCount * SESSION_DURATION_SECONDS;
};