import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { createLogger } from 'redux-logger';
import { http, history } from '../utilities';
import authReducer from './auth/auth.reducer';

export interface IActionProps {
  type: string;
  status: string;
  payload: object | unknown;
}

const rootReducer = combineReducers({
  auth: authReducer,
});

const logger = createLogger({
  collapsed: () => true,
  titleFormatter: (action: IActionProps) => {
    if (action.status) return `[${action.status}] ${action.type}`;
    return action.type;
  },
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: { http, history } },
      serializableCheck: false,
    }).concat(logger),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
