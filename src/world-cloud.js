import {
  desktopBubblePositions,
  mobileBubblePositions,
  worldCloudRows,
} from "./world-cloud-data.js";

const SHORT_NAME = 7;
const MEDIUM_NAME = 13;
const LONG_NAME = 20;

let activeTimer;
let activeInteractionCleanup;

export const getWorldCloudRows = () =>
  worldCloudRows.map((row) => ({ continent: row.continent, cities: [...row.cities] }));

const getCityPool = () =>
  worldCloudRows.flatMap((row) => row.cities.map((city) => ({ city, continent: row.continent })));

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
  const indexes = new Set();
  while (indexes.size < count && indexes.size < total) {
    indexes.add(Math.floor(Math.random() * total));
  }
  return [...indexes];
};

const buildStaggers = (count) => {
  const staggers = [0];
  for (let i = 1; i < count; i += 1) {
    staggers.push(350 + Math.floor(Math.random() * 1050));
  }
  return staggers.sort((a, b) => a - b);
};

const sizeForCity = (city, position) => {
  if (position.size === "large") return city.length <= SHORT_NAME ? "medium" : "large";
  if (position.size === "medium") return city.length <= SHORT_NAME ? "small" : "medium";
  if (city.length <= SHORT_NAME) return "tiny";
  if (city.length <= MEDIUM_NAME) return "small";
  if (city.length >= LONG_NAME) return "large";
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
  bubble.dataset.continent = entry.continent;
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
  let topZIndex = 10;

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

const initializeInteraction = (cloud, bubbles) => {
  cleanupInteraction();
  if (isMobile()) {
    initializeDrag(bubbles);
    return;
  }
  initializeRepel(cloud, bubbles);
};

const startCityRotation = (bubbles, positions, cityPool) => {
  const queue = cityPool
    .map((entry, index) => ({ entry, sort: (index * 37) % cityPool.length }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ entry }) => entry);
  let queueIndex = bubbles.length;
  let positionOffset = 3;

  return window.setInterval(() => {
    const batchSize = Math.min(Math.random() < 0.5 ? 2 : 3, bubbles.length);
    const bubbleIndexes = pickRandomIndexes(batchSize, bubbles.length);
    const staggers = buildStaggers(bubbleIndexes.length);

    bubbleIndexes.forEach((bubbleIndex, i) => {
      const currentQueueIndex = queueIndex + i;
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
    });

    queueIndex += bubbleIndexes.length;
    positionOffset = (positionOffset + 2) % positions.length;
  }, 9000);
};

export const initializeWorldCloud = () => {
  if (typeof document === "undefined") return;
  const cloud = document.querySelector("[data-world-cloud]");
  if (!cloud) return;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cityPool = getCityPool();
  const positions = getActivePositions();

  if (activeTimer) window.clearInterval(activeTimer);
  cleanupInteraction();
  cloud.replaceChildren();

  const bubbles = positions.map((position, index) => {
    const entry = cityPool[(index * 11) % cityPool.length];
    const bubble = createBubble(entry, position);
    bubble.style.setProperty("--delay", `-${1600 + index * 730}ms`);
    cloud.appendChild(bubble);
    return bubble;
  });

  if (reducedMotion) return;

  initializeInteraction(cloud, bubbles);
  activeTimer = startCityRotation(bubbles, positions, cityPool);
};
