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

  const timeFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    timeStyle: "short",
    dateStyle: "full",
  });

  nextMass.innerText = timeFormat.format(theDay);
});

window.addEventListener('load', () => {
  const ROUTE_IDS = [
    49817213, 49817248, 50460495, 50460653, 50460783,
    50460871, 51439475, 51874739, 51878912, 52804627, 53150117,
  ];

  const routeId = ROUTE_IDS[Math.floor(Math.random() * ROUTE_IDS.length)];

  const iframe = document.createElement('iframe');
  iframe.src = `https://ridewithgps.com/embeds?type=route&id=${routeId}`;
  iframe.style.width = '1px';
  iframe.style.minWidth = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.scrolling = 'no';

  routeEmbed.appendChild(iframe);
});
