"use strict";

const DenverCriticalMass = (() => {
  const formatDate = (date) => {
    const formatter = new Intl.DateTimeFormat("en", { dateStyle: "full" });
    const parts = formatter.formatToParts(date);
    return {
      month: parts.find((p) => p.type === "month").value,
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
  const ordinalSuffixes = { one: "st", two: "nd", few: "rd", other: "th" };

  const getOrdinalSuffix = (day) =>
    ordinalSuffixes[ordinalRules.select(day)] ?? ordinalSuffixes.other;

  const formatDayWithOrdinal = (day) => {
    if (typeof day !== "number" || day < 1) {
      throw new Error("Day must be a positive number");
    }
    const suffix = getOrdinalSuffix(day);
    return `${day}<sup>${suffix}</sup>`;
  };

  const getTargetDayOfWeek = (month) => {
    // November (10) through April (3): Sunday (0)
    // May (4) through October (9): Friday (5)
    if (month >= 10 || month <= 3) {
      return 0; // Sunday
    }
    return 5; // Friday
  };

  const getLastTargetDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const targetDay = getTargetDayOfWeek(month);
    const lastDay = new Date(year, month + 1, 0); // Day 0 of next month = last day of this month

    let lastTargetDay = new Date(lastDay);
    const daysToSubtract = (lastDay.getDay() - targetDay + 7) % 7;
    lastTargetDay.setDate(lastDay.getDate() - daysToSubtract);
    lastTargetDay.setHours(23, 59, 59, 999);

    if (date > lastTargetDay) {
      return getLastTargetDayOfMonth(new Date(year, month + 1, 1));
    }

    return lastTargetDay;
  };

  const isWinterSeason = (month) => {
    return month >= 10 || month <= 3;
  };

  const getEventTimes = (month) => {
    const winter = isWinterSeason(month);
    return {
      dayName: winter ? "Sunday" : "Friday",
      meetTime: winter ? "12:30pm" : "6:30pm",
      rideTime: winter ? "1:00pm" : "7:00pm",
    };
  };

  const getPreviewDate = () => {
    if (typeof window === "undefined" || !window.location) return null;
    const localPreviewHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const preview = new URLSearchParams(window.location.search).get("preview");
    return localPreviewHost && preview === "winter" ? new Date(2026, 0, 15) : null;
  };

  let worldCloudTimer;
  let worldBubbleInteractionCleanup;
  let worldBubbleTopZIndex = 10;

  const worldCloudRows = [
    {
      modifier: "north",
      cities: [
        "Denver",
        "Albuquerque",
        "Chicago",
        "Raleigh",
        "Greensboro",
        "Charlotte",
        "Gainesville",
        "Orlando",
        "Austin",
        "Houston",
        "McAllen",
        "Fort Worth",
        "Boise",
        "Bakersfield",
        "Seattle",
        "San Francisco",
        "Edmonton",
        "Calgary",
        "Montreal",
        "Kanata",
        "New London",
        "New Orleans",
        "El Paso",
        "Guadalajara",
        "Guatemala City",
        "Nanaimo",
        "Washington DC",
      ],
    },
    {
      modifier: "south",
      cities: [
        "Buenos Aires",
        "Rio de Janeiro",
        "Sao Paulo",
        "Porto Alegre",
        "Dourados",
        "Recife",
        "Caxias do Sul",
        "Goiania",
        "Guayaquil",
        "Montevideo",
        "Tarija",
        "Salvador",
        "Joao Pessoa",
        "Marilia",
        "Manaus",
        "Brasilia",
        "Campinas",
        "Natal",
      ],
    },
    {
      modifier: "europe",
      cities: [
        "London",
        "Belfast",
        "Aberdeen",
        "Dundee",
        "Inverness",
        "Norwich",
        "Dublin",
        "Antwerp",
        "Brussels",
        "Namur",
        "Lorient",
        "Lyon",
        "Millau",
        "Montpellier",
        "Nantes",
        "Nice",
        "Saint-Brieuc",
        "Toulouse",
        "Bordeaux",
        "Lisbon",
        "Porto",
        "Valencia",
        "Granada",
        "Pamplona",
        "Gasteiz",
        "Madrid",
        "Rome",
        "Firenze",
        "Milano",
        "Genova",
        "Cremona",
        "Parma",
        "Ticino",
        "Basel",
        "Bern",
        "Luzern",
        "Zurich",
        "Winti",
        "Graz",
        "Vienna",
        "St. Veit/Glan",
        "Hamburg",
        "Bremen",
        "Bonn",
        "Braunschweig",
        "Dortmund",
        "Dresden",
        "Duisburg",
        "Dusseldorf",
        "Erfurt",
        "Erlangen",
        "Freising",
        "Hildesheim",
        "Jena",
        "Kassel",
        "Ludenscheid",
        "Luneburg",
        "Mainz",
        "Munich",
        "Munster",
        "Neuss",
        "Offenbach",
        "Oldenburg",
        "Pforzheim",
        "Saarbrucken",
        "Schussental",
        "Stuttgart",
        "Trier",
        "Wolfsburg",
        "Wuppertal",
        "Prague",
        "Czestochowa",
        "Bratislava",
        "Nitra",
        "Timisoara",
        "Istanbul",
        "Izmir",
        "Bergen",
        "Gondomar",
        "Brescia",
        "Bergamo",
        "Viana do Castelo",
        "Treviso",
      ],
    },
    {
      modifier: "africa",
      cities: [
        "Nairobi",
        "Mombasa",
        "Nakuru",
        "Thika",
        "Cape Town",
        "Johannesburg",
        "Durban",
        "Casablanca",
        "Safi",
        "Dar es Salaam",
      ],
    },
    {
      modifier: "asia",
      cities: [
        "Seoul",
        "Tokyo",
        "Nagoya",
        "Jakarta",
        "Bandung",
        "Bekasi",
        "Cimahi",
        "Kendari",
        "Sukabumi",
        "Kuala Lumpur",
        "Manila",
        "Kathmandu",
        "Karachi",
        "Lahore",
      ],
    },
    {
      modifier: "oceania",
      cities: [
        "Melbourne",
        "Sydney",
        "Brisbane",
        "Adelaide",
        "Perth",
        "Canberra",
        "Hobart",
        "Dunedin",
      ],
    },
  ];

  const getWorldCloudRows = () =>
    worldCloudRows.map((row) => ({
      modifier: row.modifier,
      cities: [...row.cities],
    }));

  const worldBubblePositions = [
    { x: 18, y: 15, size: "large", tilt: -4 },
    { x: 39, y: 12, size: "small", tilt: 3 },
    { x: 58, y: 16, size: "medium", tilt: -1 },
    { x: 77, y: 22, size: "small", tilt: 5 },
    { x: 27, y: 29, size: "small", tilt: 4 },
    { x: 49, y: 31, size: "large", tilt: 2 },
    { x: 69, y: 36, size: "small", tilt: -2 },
    { x: 17, y: 43, size: "medium", tilt: -3 },
    { x: 36, y: 48, size: "medium", tilt: 2 },
    { x: 56, y: 52, size: "small", tilt: -5 },
    { x: 76, y: 55, size: "large", tilt: 3 },
    { x: 26, y: 65, size: "small", tilt: -2 },
    { x: 45, y: 68, size: "tiny", tilt: -5 },
    { x: 64, y: 72, size: "medium", tilt: 4 },
    { x: 81, y: 76, size: "tiny", tilt: -4 },
    { x: 36, y: 80, size: "medium", tilt: 2 },
  ];

  const mobileWorldBubblePositions = [
    { x: 14, y: 12, size: "medium", tilt: -4 },
    { x: 58, y: 9, size: "small", tilt: 3 },
    { x: 36, y: 24, size: "large", tilt: -1 },
    { x: 81, y: 32, size: "small", tilt: 5 },
    { x: 12, y: 40, size: "small", tilt: 4 },
    { x: 55, y: 49, size: "medium", tilt: 2 },
    { x: 30, y: 61, size: "large", tilt: -3 },
    { x: 70, y: 63, size: "small", tilt: 4 },
    { x: 86, y: 73, size: "tiny", tilt: -2 },
    { x: 15, y: 84, size: "small", tilt: 3 },
    { x: 55, y: 88, size: "medium", tilt: -5 },
    { x: 80, y: 91, size: "small", tilt: 2 },
  ];

  const getWorldCityPool = () =>
    worldCloudRows.flatMap((row) => row.cities.map((city) => ({ city, modifier: row.modifier })));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const isMobileWorldCloud = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 640px)").matches;

  const getActiveWorldBubblePositions = () => {
    if (isMobileWorldCloud()) return mobileWorldBubblePositions;
    return worldBubblePositions;
  };

  const getJitteredBubblePosition = (position, seed) => {
    const xJitter = (((seed * 17) % 7) - 3) * 0.35;
    const yJitter = (((seed * 23) % 7) - 3) * 0.45;
    const tilt = ((seed * 29 + position.x * 3 + position.y) % 15) - 7;

    return {
      ...position,
      x: clamp(position.x + xJitter, 2, 94),
      y: clamp(position.y + yJitter, 5, 92),
      tilt: clamp(tilt, -7, 7),
    };
  };

  const getRandomBubbleIndexes = (count, total) => {
    const indexes = [];
    while (indexes.length < count && indexes.length < total) {
      const nextIndex = Math.floor(Math.random() * total);
      if (!indexes.includes(nextIndex)) {
        indexes.push(nextIndex);
      }
    }
    return indexes;
  };

  const getRandomStaggers = (count) => {
    const staggers = [0];
    for (let index = 1; index < count; index += 1) {
      staggers.push(350 + Math.floor(Math.random() * 1050));
    }
    return staggers.sort((a, b) => a - b);
  };

  const getBubbleSizeForCity = (city, position) => {
    if (position.size === "large") return city.length <= 7 ? "medium" : "large";
    if (position.size === "medium") return city.length <= 7 ? "small" : "medium";
    if (city.length <= 7) return "tiny";
    if (city.length <= 13) return "small";
    if (city.length >= 20) return "large";
    return "medium";
  };

  const setBubblePosition = (bubble, position) => {
    bubble.style.setProperty("--x", `${position.x}%`);
    bubble.style.setProperty("--y", `${position.y}%`);
    bubble.style.setProperty("--tilt", `${position.tilt || 0}deg`);
    bubble.style.setProperty("--float-duration", `${10 + Math.abs(position.tilt || 0) * 0.65}s`);
    bubble.style.setProperty("--float-x", `${0.08 + ((position.x + position.y) % 7) * 0.025}rem`);
    const floatY = 0.36 + ((position.x * 3 + position.y) % 9) * 0.035;
    bubble.style.setProperty("--float-y", `${floatY}rem`);
    bubble.style.setProperty("--float-y-mid", `${floatY * 0.55}rem`);
    bubble.style.setProperty("--float-y-low", `${floatY * 0.42}rem`);
  };

  const updateBubble = (bubble, entry, position) => {
    bubble.textContent = entry.city;
    bubble.dataset.continent = entry.modifier;
    bubble.dataset.size = getBubbleSizeForCity(entry.city, position);
  };

  const createWorldBubble = (entry, position) => {
    const bubble = document.createElement("span");
    bubble.className = "world-bubble";
    setBubblePosition(bubble, position);
    updateBubble(bubble, entry, position);

    return bubble;
  };

  const setBubbleInteractionOffset = (bubble, x, y) => {
    bubble.style.setProperty("--repel-x", `${x.toFixed(2)}px`);
    bubble.style.setProperty("--repel-y", `${y.toFixed(2)}px`);
  };

  const resetWorldBubbleInteraction = () => {
    if (!worldBubbleInteractionCleanup) return;
    worldBubbleInteractionCleanup();
    worldBubbleInteractionCleanup = null;
  };

  const initializeWorldBubbleDrag = (bubbles) => {
    if (typeof window === "undefined") return;

    const states = bubbles.map((bubble) => ({
      bubble,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
      startX: 0,
      startY: 0,
      startOffsetX: 0,
      startOffsetY: 0,
      dragging: false,
    }));
    const stateByBubble = new Map(states.map((state) => [state.bubble, state]));
    const activeDrags = new Map();
    let frame = null;

    const getMaxDrag = () => clamp(window.innerWidth * 0.12, 34, 52);
    const limitOffset = (x, y) => {
      const distance = Math.hypot(x, y);
      const maxDrag = getMaxDrag();
      if (distance <= maxDrag || distance === 0) return { x, y };
      const scale = maxDrag / distance;
      return {
        x: x * scale,
        y: y * scale,
      };
    };

    const tick = () => {
      let moving = false;

      states.forEach((state) => {
        const spring = state.dragging ? 0.2 : 0.08;
        const damping = state.dragging ? 0.62 : 0.78;
        state.vx = (state.vx + (state.targetX - state.x) * spring) * damping;
        state.vy = (state.vy + (state.targetY - state.y) * spring) * damping;
        state.x += state.vx;
        state.y += state.vy;

        if (!state.dragging && Math.abs(state.x) < 0.03 && Math.abs(state.vx) < 0.03) {
          state.x = 0;
          state.vx = 0;
        }
        if (!state.dragging && Math.abs(state.y) < 0.03 && Math.abs(state.vy) < 0.03) {
          state.y = 0;
          state.vy = 0;
        }

        setBubbleInteractionOffset(state.bubble, state.x, state.y);

        if (
          state.dragging ||
          Math.abs(state.x - state.targetX) > 0.08 ||
          Math.abs(state.y - state.targetY) > 0.08 ||
          Math.abs(state.vx) > 0.08 ||
          Math.abs(state.vy) > 0.08
        ) {
          moving = true;
        }
      });

      if (moving) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = null;
      }
    };

    const startTicking = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const handlePointerDown = (event) => {
      if (!isMobileWorldCloud()) return;
      const state = stateByBubble.get(event.currentTarget);
      if (!state) return;

      event.preventDefault();
      state.dragging = true;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.startOffsetX = state.targetX;
      state.startOffsetY = state.targetY;
      state.bubble.classList.add("is-dragging");
      worldBubbleTopZIndex += 1;
      state.bubble.style.zIndex = String(worldBubbleTopZIndex);
      activeDrags.set(event.pointerId, state);

      if (state.bubble.setPointerCapture) {
        state.bubble.setPointerCapture(event.pointerId);
      }
      startTicking();
    };

    const handlePointerMove = (event) => {
      const state = activeDrags.get(event.pointerId);
      if (!state) return;

      event.preventDefault();
      const nextOffset = limitOffset(
        state.startOffsetX + event.clientX - state.startX,
        state.startOffsetY + event.clientY - state.startY,
      );
      state.targetX = nextOffset.x;
      state.targetY = nextOffset.y;
      startTicking();
    };

    const finishDrag = (event) => {
      const state = activeDrags.get(event.pointerId);
      if (!state) return;

      activeDrags.delete(event.pointerId);
      state.dragging = false;
      state.targetX = 0;
      state.targetY = 0;
      state.bubble.classList.remove("is-dragging");

      if (state.bubble.releasePointerCapture && state.bubble.hasPointerCapture?.(event.pointerId)) {
        state.bubble.releasePointerCapture(event.pointerId);
      }
      startTicking();
    };

    const releaseAll = () => {
      activeDrags.clear();
      states.forEach((state) => {
        state.dragging = false;
        state.targetX = 0;
        state.targetY = 0;
        state.bubble.classList.remove("is-dragging");
      });
      startTicking();
    };

    bubbles.forEach((bubble) => {
      bubble.addEventListener("pointerdown", handlePointerDown);
    });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    window.addEventListener("blur", releaseAll);

    worldBubbleInteractionCleanup = () => {
      bubbles.forEach((bubble) => {
        bubble.removeEventListener("pointerdown", handlePointerDown);
        bubble.classList.remove("is-dragging");
      });
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
      window.removeEventListener("blur", releaseAll);
      if (frame) window.cancelAnimationFrame(frame);
      states.forEach((state) => setBubbleInteractionOffset(state.bubble, 0, 0));
      activeDrags.clear();
      frame = null;
    };
  };

  const initializeWorldBubbleRepel = (cloud, bubbles, reducedMotion) => {
    if (reducedMotion || typeof window === "undefined") return;

    const states = bubbles.map((bubble) => ({
      bubble,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    }));
    const pointer = { active: false, x: 0, y: 0 };
    let frame = null;

    const setTargets = () => {
      const radius = 170;
      const maxPush = 28;

      states.forEach((state) => {
        if (!pointer.active) {
          state.targetX = 0;
          state.targetY = 0;
          return;
        }

        const rect = state.bubble.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX - pointer.x;
        const dy = centerY - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance > radius) {
          state.targetX = 0;
          state.targetY = 0;
          return;
        }

        const pull = (1 - distance / radius) ** 2;
        const push = maxPush * pull;
        state.targetX = (dx / distance) * push;
        state.targetY = (dy / distance) * push;
      });
    };

    const tick = () => {
      let moving = false;
      states.forEach((state) => {
        state.x += (state.targetX - state.x) * 0.08;
        state.y += (state.targetY - state.y) * 0.08;

        if (Math.abs(state.x) < 0.03) state.x = 0;
        if (Math.abs(state.y) < 0.03) state.y = 0;

        setBubbleInteractionOffset(state.bubble, state.x, state.y);

        if (Math.abs(state.x - state.targetX) > 0.08 || Math.abs(state.y - state.targetY) > 0.08) {
          moving = true;
        }
      });

      if (moving || pointer.active) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = null;
      }
    };

    const startTicking = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (event) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setTargets();
      startTicking();
    };

    const releasePointer = () => {
      pointer.active = false;
      setTargets();
      startTicking();
    };

    cloud.addEventListener("pointermove", handlePointerMove);
    cloud.addEventListener("pointerleave", releasePointer);
    cloud.addEventListener("pointercancel", releasePointer);
    window.addEventListener("blur", releasePointer);

    worldBubbleInteractionCleanup = () => {
      cloud.removeEventListener("pointermove", handlePointerMove);
      cloud.removeEventListener("pointerleave", releasePointer);
      cloud.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("blur", releasePointer);
      if (frame) window.cancelAnimationFrame(frame);
      states.forEach((state) => setBubbleInteractionOffset(state.bubble, 0, 0));
      frame = null;
    };
  };

  const initializeWorldBubbleInteraction = (cloud, bubbles, reducedMotion) => {
    resetWorldBubbleInteraction();
    if (reducedMotion || typeof window === "undefined") return;
    if (isMobileWorldCloud()) {
      initializeWorldBubbleDrag(bubbles);
      return;
    }
    initializeWorldBubbleRepel(cloud, bubbles, reducedMotion);
  };

  const initializeWorldCloud = () => {
    if (typeof document === "undefined") return;
    const cloud = document.querySelector("[data-world-cloud]");
    if (!cloud) return;

    const cityPool = getWorldCityPool();
    const activePositions = getActiveWorldBubblePositions();
    if (worldCloudTimer && typeof window !== "undefined" && window.clearInterval) {
      window.clearInterval(worldCloudTimer);
    }

    worldBubbleTopZIndex = 10;
    resetWorldBubbleInteraction();
    cloud.replaceChildren();

    const bubbles = activePositions.map((position, index) => {
      const entry = cityPool[(index * 11) % cityPool.length];
      const bubble = createWorldBubble(entry, position);
      bubble.style.setProperty("--delay", `-${1600 + index * 730}ms`);
      cloud.appendChild(bubble);
      return bubble;
    });

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    initializeWorldBubbleInteraction(cloud, bubbles, reducedMotion);

    if (!reducedMotion && typeof window !== "undefined" && window.setInterval) {
      const queue = cityPool
        .map((entry, index) => ({ entry, sort: (index * 37) % cityPool.length }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ entry }) => entry);
      let queueIndex = bubbles.length;
      let positionOffset = 3;

      worldCloudTimer = window.setInterval(() => {
        const batchSize = Math.min(Math.random() < 0.5 ? 2 : 3, bubbles.length);
        const bubbleIndexes = getRandomBubbleIndexes(batchSize, bubbles.length);
        const staggers = getRandomStaggers(bubbleIndexes.length);

        for (let batchIndex = 0; batchIndex < bubbleIndexes.length; batchIndex += 1) {
          const currentQueueIndex = queueIndex + batchIndex;
          const bubbleIndex = bubbleIndexes[batchIndex];
          const bubble = bubbles[bubbleIndex];
          const entry = queue[currentQueueIndex % queue.length];
          const nextPosition = getJitteredBubblePosition(
            activePositions[bubbleIndex],
            currentQueueIndex + positionOffset,
          );

          window.setTimeout(() => {
            if (bubble.classList.contains("is-dragging")) return;
            bubble.classList.add("is-changing");
            window.setTimeout(() => {
              setBubblePosition(bubble, nextPosition);
              updateBubble(bubble, entry, nextPosition);
              bubble.classList.remove("is-changing");
              bubble.classList.add("is-settling");
              window.setTimeout(() => {
                bubble.classList.remove("is-settling");
              }, 1800);
            }, 1450);
          }, staggers[batchIndex]);
        }

        queueIndex += bubbleIndexes.length;
        positionOffset = (positionOffset + 2) % activePositions.length;
      }, 9000);
    }
  };

  const updateSeasonTheme = (month) => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.season = isWinterSeason(month) ? "winter" : "summer";
  };

  const updateDOM = () => {
    const monthEl = document.querySelector("[data-month]");
    const dayEl = document.querySelector("[data-day]");
    const dayPlainEl = document.querySelector("[data-day-plain]");
    const yearEl = document.querySelector("[data-year]");
    const dayNameEl = document.querySelector("[data-day-name]");
    const meetTimeEl = document.querySelector("[data-meet-time]");
    const rideTimeEl = document.querySelector("[data-ride-time]");
    const winterHoursEl = document.querySelector("[data-winter-hours]");

    if (
      !monthEl ||
      (!dayEl && !dayPlainEl) ||
      !yearEl ||
      !dayNameEl ||
      !meetTimeEl ||
      !rideTimeEl
    ) {
      console.error("Required DOM elements not found");
      return;
    }

    const now = getPreviewDate() || new Date();
    const lastTargetDay = getLastTargetDayOfMonth(now);
    const { month, day, year } = formatDate(lastTargetDay);
    const dayWithSuffix = formatDayWithOrdinal(day);
    const targetMonth = lastTargetDay.getMonth();
    const times = getEventTimes(targetMonth);

    updateSeasonTheme(targetMonth);

    monthEl.innerHTML = month;
    if (dayEl) dayEl.innerHTML = dayWithSuffix;
    if (dayPlainEl) dayPlainEl.textContent = `${day}${getOrdinalSuffix(day)}`;
    yearEl.innerHTML = year;
    dayNameEl.innerHTML = times.dayName;
    meetTimeEl.innerHTML = times.meetTime;
    rideTimeEl.innerHTML = times.rideTime;

    if (winterHoursEl) {
      winterHoursEl.innerHTML = isWinterSeason(targetMonth) ? "Winter Hours: Sundays" : "";
    }
  };

  return {
    formatDate,
    getOrdinalSuffix,
    formatDayWithOrdinal,
    getTargetDayOfWeek,
    getLastTargetDayOfMonth,
    isWinterSeason,
    getEventTimes,
    getPreviewDate,
    getWorldCloudRows,
    initializeWorldCloud,
    updateSeasonTheme,
    updateDOM,
  };
})();

const initializePage = () => {
  if (typeof document === "undefined" || !document.querySelector("[data-month]")) return;
  DenverCriticalMass.updateDOM();
  DenverCriticalMass.initializeWorldCloud();
};

if (typeof window !== "undefined") {
  if (typeof document !== "undefined" && document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initializePage);
  } else {
    initializePage();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = DenverCriticalMass;
}
if (typeof window !== "undefined") {
  window.DenverCriticalMass = DenverCriticalMass;
}
