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

export const getHostname = (env) => {
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

export const getApiUrl = ({ localOverride }) => {
  const isLocal = getEnvironment() === "local";
  const useLocal = isLocal && !localOverride;
  const hostname = getHostname(isLocal && localOverride);
  const url = useLocal ? "/api" : `https://api.${hostname}`;
  return url;
};

export const getDateRange = (
  start: string | number | Date,
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

export const convertShortISO = (dateString: string) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(5, 7);
  const day = dateString.slice(8, 10);
  return `${month}/${day}/${year}`;
};
