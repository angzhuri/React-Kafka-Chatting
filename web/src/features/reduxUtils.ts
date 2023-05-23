/* eslint-disable @typescript-eslint/no-explicit-any */
import { omit } from 'lodash';

export interface DefaultInitialState {
  loading: { [key: string]: boolean };
  error: null | undefined;
}

export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export const handleAsyncAction = (state: any, status: string, payload: object | unknown, type: string) => {
  return (newState = state) => {
    const loading = {
      ...state,
      loading: { ...state.loading, [type]: true },
      error: null,
    };
    const success = {
      ...state,
      loading: omit(state.loading, type),
      error: null,
    };
    const failure = {
      ...state,
      loading: omit(state.loading, type),
      error: payload,
    };

    switch (status) {
      case 'loading':
        return loading;
      case 'success':
        return { ...success, ...newState };
      case 'failure':
        return failure;
      default:
        return state;
    }
  };
};
