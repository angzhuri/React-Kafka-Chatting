import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const requestHandler = async (request: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    request.headers.Authorization = token;
  }

  return request;
};

const successHandler = (response: AxiosResponse) => {
  return response;
};

interface CustomAxiosError extends AxiosError {
  config: InternalAxiosRequestConfig & { isCustomErrorMessage?: boolean };
  code?: string;
  request?: unknown;
  response?: AxiosResponse;
}

const errorHandler = (error: CustomAxiosError) => {
  if (!error.config.isCustomErrorMessage) {
    if (error.response) {
      console.error(error.response);

      if (error.response.data.errors) {
        message.error(error.response.data.errors[0], 5);
      } else {
        message.error('Something went wrong');
      }
    } else {
      console.error(error);
      message.error(error.message);
    }
  }

  return Promise.reject(error.response ? error.response : error);
};

http.interceptors.request.use((request) => requestHandler(request));

http.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
);
