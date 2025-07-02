import axios from 'axios';
import { setupInterceptors } from './interceptors';

// 改良版本
export function createAxios(options = {}) {
  const defaultOptions = {
    // 根据环境变量决定 baseURL
    baseURL: import.meta.env.VITE_API_BASE_URL ?
      `${import.meta.env.VITE_API_BASE_URL}/api` :
      '/api',
    timeout: 12000,
  };
  const service = axios.create({
    ...defaultOptions,
    ...options,
  });
  setupInterceptors(service);
  return service;
}
// 默认版本
// export function createAxios(options = {}) {
//   const defaultOptions = {
//     baseURL: '/api',
//     timeout: 12000,
//   };
//   const service = axios.create({
//     ...defaultOptions,
//     ...options,
//   });
//   setupInterceptors(service);
//   return service;
// }

export const request = createAxios();

export const mockRequest = createAxios({
  baseURL: '/mock-api',
});
