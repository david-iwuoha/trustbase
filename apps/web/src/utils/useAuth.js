// src/utils/useAuth.js
import { useCallback } from "react";

function useAuth() {
  // Simulate a backend call with a Promise
  const fakeAuth = (provider, options = {}) => {
    return new Promise((resolve) => {
      console.log(`Signing in with ${provider}`, options);
      setTimeout(() => {
        resolve({ success: true, provider, user: { email: options.email || "user@example.com" } });
      }, 800);
    });
  };

  const signInWithCredentials = useCallback((options) => {
    return fakeAuth("credentials-signin", options);
  }, []);

  const signUpWithCredentials = useCallback((options) => {
    return fakeAuth("credentials-signup", options);
  }, []);

  const signInWithGoogle = useCallback((options) => {
    return fakeAuth("google", options);
  }, []);

  const signInWithFacebook = useCallback((options) => {
    return fakeAuth("facebook", options);
  }, []);

  const signInWithTwitter = useCallback((options) => {
    return fakeAuth("twitter", options);
  }, []);

  const signOut = useCallback(() => {
    console.log("User signed out");
    return Promise.resolve({ success: true });
  }, []);

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signOut,
  };
}

export default useAuth;
