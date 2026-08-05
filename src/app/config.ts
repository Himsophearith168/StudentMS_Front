export const DEFAULT_API_BASE_URL = '/api/v1';
export const DEFAULT_API_KEY = '';

const env = (window as any).__env__ || {};

export const API_BASE_URL = env.API_BASE_URL || DEFAULT_API_BASE_URL;
export const API_KEY = env.API_KEY || DEFAULT_API_KEY;
