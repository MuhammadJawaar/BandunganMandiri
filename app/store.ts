// store.ts
import { makeAutoObservable, action } from 'mobx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';

class AuthStore {
  isLoggedIn = false;
  initialized = false;
  user = null;

  constructor() {
    makeAutoObservable(this, {
      // Define actions explicitly
      signIn: action,
      signOut: action,
    });

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      this.updateAuthState(user);
    });
  }

  // Action to update authentication state
  updateAuthState(user: any) {
    this.user = user;
    this.isLoggedIn = !!user;
    this.initialized = true;
  }

  // Action to sign in
  signIn(user: any) {
    this.updateAuthState(user);
  }

  // Action to sign out
  signOut() {
    this.updateAuthState(null);
  }
}

export const authStore = new AuthStore();
