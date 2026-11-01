window.addEventListener('load', () => {
  const now = new Date();
  const today = now.getDay();
  const month = now.getMonth();
  const year = now.getFullYear();

  const is_winter = month >= 10 || month <= 3;
  const ride_day = is_winter ? 0 : 5;
  const start_hour = is_winter ? 12 : 18;

  const nextMonth = month == 11 ? 1 : month + 1;
  const nextYear = month == 11 ? year + 1 : year;

  let theMeet = new Date(nextYear, nextMonth, 0, start_hour, 30); // start from the end of the month
  let day = theMeet.getDay();

  while(day !== ride_day) {
    theMeet = new Date(theMeet - (1000 * 60 * 60 * 24))
    day = theMeet.getDay();
  }

  const rideDayFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    dateStyle: "full",
  });

  const meetFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    timeStyle: "short",
  });

  const theRide = new Date(theMeet.getTime() + 1000 * 60 * 30);

  const rideFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    timeStyle: "short",
  });

  nextRideDay.innerText = rideDayFormat.format(theMeet);
  nextRideMeet.innerText = meetFormat.format(theMeet);
  nextRideGo.innerText = rideFormat.format(theRide);
});
