import { updateDOM } from "./dom.js";
import { initializeWorldCloud } from "./world-cloud.js";

const initializePage = () => {
  if (!document.querySelector("[data-month]")) return;
  updateDOM();
  initializeWorldCloud();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
