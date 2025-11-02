export const saveToken = (token) => localStorage.setItem("token", token);
export const clearAuth = () => localStorage.removeItem("token");
export const isAuthenticated = () => !!localStorage.getItem("token");