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

const desktopBubblePositions = [
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

const mobileBubblePositions = [
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

let activeTimer;
let activeInteractionCleanup;
let topZIndex = 10;

export const getWorldCloudRows = () =>
  worldCloudRows.map((row) => ({ modifier: row.modifier, cities: [...row.cities] }));

const getCityPool = () =>
  worldCloudRows.flatMap((row) => row.cities.map((city) => ({ city, modifier: row.modifier })));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(max-width: 640px)").matches;

const getActivePositions = () => (isMobile() ? mobileBubblePositions : desktopBubblePositions);

const jitterPosition = (position, seed) => ({
  ...position,
  x: clamp(position.x + (((seed * 17) % 7) - 3) * 0.35, 2, 94),
  y: clamp(position.y + (((seed * 23) % 7) - 3) * 0.45, 5, 92),
  tilt: clamp(((seed * 29 + position.x * 3 + position.y) % 15) - 7, -7, 7),
});

const pickRandomIndexes = (count, total) => {
  const indexes = [];
  while (indexes.length < count && indexes.length < total) {
    const next = Math.floor(Math.random() * total);
    if (!indexes.includes(next)) indexes.push(next);
  }
  return indexes;
};

const buildStaggers = (count) => {
  const staggers = [0];
  for (let i = 1; i < count; i += 1) {
    staggers.push(350 + Math.floor(Math.random() * 1050));
  }
  return staggers.sort((a, b) => a - b);
};

const sizeForCity = (city, position) => {
  if (position.size === "large") return city.length <= 7 ? "medium" : "large";
  if (position.size === "medium") return city.length <= 7 ? "small" : "medium";
  if (city.length <= 7) return "tiny";
  if (city.length <= 13) return "small";
  if (city.length >= 20) return "large";
  return "medium";
};

const applyPosition = (bubble, position) => {
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

const applyEntry = (bubble, entry, position) => {
  bubble.textContent = entry.city;
  bubble.dataset.continent = entry.modifier;
  bubble.dataset.size = sizeForCity(entry.city, position);
};

const createBubble = (entry, position) => {
  const bubble = document.createElement("span");
  bubble.className = "world-bubble";
  applyPosition(bubble, position);
  applyEntry(bubble, entry, position);
  return bubble;
};

const setOffset = (bubble, x, y) => {
  bubble.style.setProperty("--repel-x", `${x.toFixed(2)}px`);
  bubble.style.setProperty("--repel-y", `${y.toFixed(2)}px`);
};

const cleanupInteraction = () => {
  if (!activeInteractionCleanup) return;
  activeInteractionCleanup();
  activeInteractionCleanup = null;
};

const initializeDrag = (bubbles) => {
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
  const stateByBubble = new Map(states.map((s) => [s.bubble, s]));
  const activeDrags = new Map();
  let frame = null;

  const limitOffset = (x, y) => {
    const distance = Math.hypot(x, y);
    const maxDrag = clamp(window.innerWidth * 0.12, 34, 52);
    if (distance <= maxDrag || distance === 0) return { x, y };
    const scale = maxDrag / distance;
    return { x: x * scale, y: y * scale };
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

      setOffset(state.bubble, state.x, state.y);

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

    frame = moving ? window.requestAnimationFrame(tick) : null;
  };

  const startTicking = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };

  const handlePointerDown = (event) => {
    if (!isMobile()) return;
    const state = stateByBubble.get(event.currentTarget);
    if (!state) return;

    event.preventDefault();
    state.dragging = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startOffsetX = state.targetX;
    state.startOffsetY = state.targetY;
    state.bubble.classList.add("is-dragging");
    topZIndex += 1;
    state.bubble.style.zIndex = String(topZIndex);
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
    const next = limitOffset(
      state.startOffsetX + event.clientX - state.startX,
      state.startOffsetY + event.clientY - state.startY,
    );
    state.targetX = next.x;
    state.targetY = next.y;
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

  bubbles.forEach((bubble) => bubble.addEventListener("pointerdown", handlePointerDown));
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", finishDrag);
  window.addEventListener("pointercancel", finishDrag);
  window.addEventListener("blur", releaseAll);

  activeInteractionCleanup = () => {
    bubbles.forEach((bubble) => {
      bubble.removeEventListener("pointerdown", handlePointerDown);
      bubble.classList.remove("is-dragging");
    });
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    window.removeEventListener("blur", releaseAll);
    if (frame) window.cancelAnimationFrame(frame);
    states.forEach((state) => setOffset(state.bubble, 0, 0));
    activeDrags.clear();
    frame = null;
  };
};

const initializeRepel = (cloud, bubbles) => {
  if (typeof window === "undefined") return;

  const states = bubbles.map((bubble) => ({ bubble, x: 0, y: 0, targetX: 0, targetY: 0 }));
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
      const dx = rect.left + rect.width / 2 - pointer.x;
      const dy = rect.top + rect.height / 2 - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;

      if (distance > radius) {
        state.targetX = 0;
        state.targetY = 0;
        return;
      }

      const push = maxPush * (1 - distance / radius) ** 2;
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

      setOffset(state.bubble, state.x, state.y);

      if (Math.abs(state.x - state.targetX) > 0.08 || Math.abs(state.y - state.targetY) > 0.08) {
        moving = true;
      }
    });

    frame = moving || pointer.active ? window.requestAnimationFrame(tick) : null;
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

  activeInteractionCleanup = () => {
    cloud.removeEventListener("pointermove", handlePointerMove);
    cloud.removeEventListener("pointerleave", releasePointer);
    cloud.removeEventListener("pointercancel", releasePointer);
    window.removeEventListener("blur", releasePointer);
    if (frame) window.cancelAnimationFrame(frame);
    states.forEach((state) => setOffset(state.bubble, 0, 0));
    frame = null;
  };
};

const initializeInteraction = (cloud, bubbles, reducedMotion) => {
  cleanupInteraction();
  if (reducedMotion || typeof window === "undefined") return;
  if (isMobile()) {
    initializeDrag(bubbles);
    return;
  }
  initializeRepel(cloud, bubbles);
};

export const initializeWorldCloud = () => {
  if (typeof document === "undefined") return;
  const cloud = document.querySelector("[data-world-cloud]");
  if (!cloud) return;

  const cityPool = getCityPool();
  const positions = getActivePositions();
  if (activeTimer && typeof window !== "undefined" && window.clearInterval) {
    window.clearInterval(activeTimer);
  }

  topZIndex = 10;
  cleanupInteraction();
  cloud.replaceChildren();

  const bubbles = positions.map((position, index) => {
    const entry = cityPool[(index * 11) % cityPool.length];
    const bubble = createBubble(entry, position);
    bubble.style.setProperty("--delay", `-${1600 + index * 730}ms`);
    cloud.appendChild(bubble);
    return bubble;
  });

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initializeInteraction(cloud, bubbles, reducedMotion);

  if (reducedMotion || typeof window === "undefined" || !window.setInterval) return;

  const queue = cityPool
    .map((entry, index) => ({ entry, sort: (index * 37) % cityPool.length }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ entry }) => entry);
  let queueIndex = bubbles.length;
  let positionOffset = 3;

  activeTimer = window.setInterval(() => {
    const batchSize = Math.min(Math.random() < 0.5 ? 2 : 3, bubbles.length);
    const bubbleIndexes = pickRandomIndexes(batchSize, bubbles.length);
    const staggers = buildStaggers(bubbleIndexes.length);

    for (let i = 0; i < bubbleIndexes.length; i += 1) {
      const currentQueueIndex = queueIndex + i;
      const bubbleIndex = bubbleIndexes[i];
      const bubble = bubbles[bubbleIndex];
      const entry = queue[currentQueueIndex % queue.length];
      const nextPosition = jitterPosition(
        positions[bubbleIndex],
        currentQueueIndex + positionOffset,
      );

      window.setTimeout(() => {
        if (bubble.classList.contains("is-dragging")) return;
        bubble.classList.add("is-changing");
        window.setTimeout(() => {
          applyPosition(bubble, nextPosition);
          applyEntry(bubble, entry, nextPosition);
          bubble.classList.remove("is-changing");
          bubble.classList.add("is-settling");
          window.setTimeout(() => bubble.classList.remove("is-settling"), 1800);
        }, 1450);
      }, staggers[i]);
    }

    queueIndex += bubbleIndexes.length;
    positionOffset = (positionOffset + 2) % positions.length;
  }, 9000);
};
