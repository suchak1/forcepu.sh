export const getEnvironment = () => {
  const hostname = window.location.hostname;
  switch (hostname) {
    case "localhost":
      return "local";
    case "dev.forcepu.sh":
      return "dev";
    default:
      return "prod";
  }
};

export const getHostname = (env: string | boolean) => {
  switch (env) {
    case "local":
      return "localhost";
    case "dev":
      return "dev.forcepu.sh";
    case "prod":
      return "forcepu.sh";
    default:
      return window.location.hostname;
  }
};

export const getApiUrl = ({ localOverride } = { localOverride: "" }) => {
  const isLocal = getEnvironment() === "local";
  const useLocal = isLocal && !localOverride;
  const hostname = getHostname(isLocal && localOverride);
  const url = useLocal ? "/api" : `https://api.${hostname}`;
  return url;
};

export const getDateRange = (
  start: string | Date,
  end: string | number | Date,
  steps = 1
) => {
  const range = [];
  let curr = new Date(start);

  if (typeof end === "number") {
    const tmp = new Date(start);
    tmp.setUTCDate(tmp.getUTCDate() + end);
    end = tmp;
  }

  while (curr <= new Date(end)) {
    range.push(new Date(curr));
    // Use UTC date to prevent problems with time zones and DST
    curr.setUTCDate(curr.getUTCDate() + steps);
  }

  return range;
};

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getDayDiff = (start: string | Date, end: string | Date) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startUTC = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endUTC = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  const diff = Math.floor((endUTC - startUTC) / _MS_PER_DAY);
  return diff;
};

export const addDays = (date: string | Date, steps = 0) => {
  const newDate = new Date(date);
  newDate.setUTCDate(newDate.getUTCDate() + steps);
  return newDate;
};

export const convertShortISO = (dateString: string) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(5, 7);
  const day = dateString.slice(8, 10);
  return `${month}/${day}/${year}`;
};

export const getLoginLoading = (setLoginLoading: any) => () => {
  setLoginLoading(window.location?.search?.indexOf("?code=") === 0);
};

export const getAccount = (
  loggedIn: any,
  setAccount: any,
  setAccountLoading: any
) => () => {
  if (loggedIn) {
    setAccountLoading(true);
    const { idToken } = loggedIn.signInUserSession;
    const url = `${getApiUrl()}/account`;
    fetch(url, {
      method: "GET",
      headers: { Authorization: idToken.jwtToken },
    })
      .then((response) => response.json())
      .then((data) => setAccount(data))
      .catch((err) => console.error(err))
      .finally(() => setAccountLoading(false));
  }
};

// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
export const transpose = (matrix: any[][]) =>
  matrix[0].map((_, i) => matrix.map((row) => row[i]));

export const signalColors = {
  BUY: "lime",
  SELL: "red",
  HODL: "#F7931A",
};

export const signalEmojis = {
  BUY: "🚀",
  SELL: "💥",
};
