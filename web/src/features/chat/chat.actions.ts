export const send_message = (status: string, payload?: object) => {
  return { type: 'send_message', status, payload };
};
