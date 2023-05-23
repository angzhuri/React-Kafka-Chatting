import { Dispatch } from '@reduxjs/toolkit';
import { auth_initialized } from './auth.actions';

export const authInitialized = () => {
  return async (dispatch: Dispatch) => {
    dispatch(auth_initialized());
  };
};

export const clearAuthState = () => {
  return async () => {
    localStorage.clear();
    sessionStorage.clear();
  };
};
