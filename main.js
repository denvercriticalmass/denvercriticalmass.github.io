window.addEventListener('load', () => {
  const WINTER_DAY = 0;
  const SUMMER_DAY = 5;

  const SUMMER_START = 18;
  const WINTER_START = 12;

  const now = new Date();

  const today = now.getDay();
  const month = now.getMonth();
  const year = now.getFullYear() ;

  const nextMonth = month == 11 ? 1 : month + 1;
  const nextYear = month == 11 ? year + 1 : year;

  let theDay = new Date(nextYear, nextMonth, 0, SUMMER_START, 30); // start from the end of the month
  let day = theDay.getDay();

  while(day !== SUMMER_DAY) {
    theDay = new Date(theDay - (1000 * 60 * 60 * 24))
    day = theDay.getDay();
  }

  console.log('theDay is', theDay)
});
