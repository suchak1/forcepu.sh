export const getApiUrl = () => {
  const hostname = window.location.hostname;
  return `https://api.${hostname}`;
};
