import { handleAsyncAction, DefaultInitialState } from '../reduxUtils';
import { IActionProps } from '../store';

interface AuthState extends DefaultInitialState {
  clientId: string | null;
  isAdmin: boolean;
  authUser: [] | null;
}

const initialState: AuthState = {
  clientId: null,
  isAdmin: false,
  authUser: null,
  loading: { init: true },
  error: null,
};

const authReducer = (state = initialState, { type, payload, status }: IActionProps): AuthState => {
  const asyncAction = handleAsyncAction(state, status, payload, type);
  const success = status === 'success';

  switch (type) {
    case 'auth_initialized':
      return { ...state, loading: {} };
    case 'login_user':
      return asyncAction(success && { authUser: payload, loading: {} });
    default:
      return state;
  }
};

export default authReducer;
