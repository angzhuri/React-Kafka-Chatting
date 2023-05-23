import { handleAsyncAction, DefaultInitialState } from '../reduxUtils';
import { IActionProps } from '../store';

interface ChatState extends DefaultInitialState {
  message: object;
}

const initialState: ChatState = {
  message: null,
  loading: { init: true },
  error: null,
};

const chatReducer = (state = initialState, { type, payload, status }: IActionProps): ChatState => {
  const asyncAction = handleAsyncAction(state, status, payload, type);
  const success = status === 'success';

  switch (type) {
    case 'send_message':
      return asyncAction(success && { message: payload });
    default:
      return state;
  }
};

export default chatReducer;
