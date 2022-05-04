export const getApiUrl = () => {
  const hostname = window.location.hostname;
  const url = hostname === "localhost" ? "/api" : `https://api.${hostname}`;
  return url;
};

// 1

var getDaysArray = function (start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

var daylist = getDaysArray(new Date("2022-04-15"), new Date());
console.log(daylist.map((d) => d.toISOString().slice(0, 10)));

// 2

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

daylist = getDates(new Date("2022-04-15"), new Date());
console.log(daylist.map((d) => d.toISOString().slice(0, 10)));

// 3

function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

daylist = dateRange(new Date("2022-04-15"), new Date());
console.log(daylist.map((d) => d.toISOString().slice(0, 10)));
