export interface Exercise {
  name: string;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  actions: number;
  intensity: 'Low' | 'Medium' | 'High';
  exercises?: Exercise[];
}

export interface Session {
  id: string;
  plan: Plan;
  date: Date;
  userId: string;
}

export interface BodyArea {
  id: string;
  label: string;
}

export interface UserProfile {
  displayName: string;
  avatarDataUrl: string | null;
}