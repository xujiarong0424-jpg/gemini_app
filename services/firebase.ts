// Firebase imports removed due to environment configuration issues.
// The application will fallback to LocalStorage.

export const appId = typeof (window as any).__app_id !== 'undefined' 
  ? (window as any).__app_id 
  : 'default-app-id';

export const initialAuthToken = typeof (window as any).__initial_auth_token !== 'undefined' 
  ? (window as any).__initial_auth_token 
  : null;

// Export undefined to ensure App.tsx uses the LocalStorage fallback logic
export const app = undefined;
export const auth = undefined;
export const db = undefined;
