const TOKEN_KEY = 'haoyue_quant_token';
const REFRESH_TOKEN_KEY = 'haoyue_quant_refresh_token';
const USER_INFO_KEY = 'haoyue_quant_user_info';

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getUserInfo = (): any => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
};

export const setUserInfo = (userInfo: any): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY);
};

export const clearAuthInfo = (): void => {
  removeToken();
  removeRefreshToken();
  removeUserInfo();
};

export const isLogin = (): boolean => {
  return !!getToken();
};

export const isVIP = (): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.role === 'vip' || userInfo?.role === 'admin';
};

export const isAdmin = (): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.role === 'admin';
};