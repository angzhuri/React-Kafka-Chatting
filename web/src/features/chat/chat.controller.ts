import { Dispatch } from '@reduxjs/toolkit';
import { send_message } from './chat.actions';
import { http } from '../../utilities';

export const sendMessage = (values: object[], callback?: VoidFunction) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(send_message('loading'));
      const data = await http.post('/api/chat/send', values);
      dispatch(send_message('success', data.data.data));

      if (callback) callback();
    } catch (error) {
      dispatch(send_message('failure', error));
    }
  };
};
