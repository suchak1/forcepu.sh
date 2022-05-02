export const getApiUrl = () => {
  const hostname = window.location.hostname;
  const url = hostname === "localhost" ? "/api" : `https://api.${hostname}`;
  return url;
};
