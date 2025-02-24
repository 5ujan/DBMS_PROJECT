// store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null, // initial state for user
  role: null,  // initial state for role
  error: null, // initial state for error

  setUser: (userData) => set({ user: userData }),
  setRole: (roleData) => set({ role: roleData }),
  setError: (errorMessage) => set({ error: errorMessage }),
}));

export { useStore }; // Named export
