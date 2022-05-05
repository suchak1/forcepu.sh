export const getApiUrl = () => {
  const hostname = window.location.hostname;
  const url = hostname === "localhost" ? "/api" : `https://api.${hostname}`;
  return url;
};

export const getDateRange = (
  start: string | number | Date,
  end: string | number | Date,
  steps = 1
) => {
  const range = [];
  let curr = new Date(start);

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
