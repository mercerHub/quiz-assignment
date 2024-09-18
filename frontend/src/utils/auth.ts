export const getToken = (key:string) => {
    return localStorage.getItem(key); // Adjust to use cookies if needed
  };
  
  export const setTokens = (accessToken:string, refreshToken:string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };
  
  export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };
  