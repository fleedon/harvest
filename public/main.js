// main.js — cleaned up, currency HUD integrated
import { GamePhase, GamePhaseManager } from "./gamePhases.js";
import { SoundManager } from "./soundManager.js";
import { PowderAllocationPhaseUI } from "./powderAllocationPhaseUI.js";
import { ItemThrowerPhase } from "./itemThrowerPhase.js";
import { GrowthPhaseUI } from "./growthPhaseUI.js";
import { ResultPhaseUI } from "./resultPhaseUI.js";
import { CurrencyBar } from "./currencyBar.js";
import { fetchElfRate } from "./fetchElfPrice.js";

/***** 1.  DOM Elements *****/
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const currencyCanvas = document.getElementById("currencyCanvas");
const currencyCtx = currencyCanvas.getContext("2d");
const overlay = document.getElementById("overlay");
const resultUI = document.getElementById("resultUI");

// Buttons
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");
const historyBtn = document.getElementById("historyBtn");
const muteBtn = document.getElementById("muteBtn");

/***** 2.  Core Singletons *****/
const sound = new SoundManager();
const phaseManager = new GamePhaseManager();
const currencyBar = new CurrencyBar(currencyCanvas, currencyCtx);

/***** 3.  Temporary Player State (replace with save/load later) *****/
const playerStatus = {
  currency: { ELF: 0, EN: 0, ES: 0 }
};

let currentRate = 0.93; // Fallback until API fetch
currencyBar.updateRate(currentRate);
currencyBar.updateBalances(playerStatus.currency);

/***** 4.  Fetch ELF/EN rate every 60s *****/
async function refreshRate() {
  try {
    const rate = await fetchElfRate();
    if (typeof rate === "number" && rate > 0) {
      currentRate = rate;
      currencyBar.updateRate(currentRate);
    }
  } catch (err) {
    console.warn("Rate fetch failed", err);
  }
}
refreshRate();
setInterval(refreshRate, 60000);

/***** 5.  Game‑wide variables *****/
let currentPhase = null;
let lastTimestamp = 0;
let seedCount = 0;
let totalPowder = 0;

/***** 6.  Button Events *****/
startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  sound.play("start");
  sound.playBgm();
  startGame();
});

retryBtn.addEventListener("click", () => location.reload());

muteBtn.addEventListener("click", () => sound.toggleMute());

/***** 7.  Game Flow *****/
function startGame() {
  seedCount = 0;
  totalPowder = 0;
  phaseManager.setPhase(GamePhase.SEED_COLLECTION);
  initSeedCatchPhase();
  requestAnimationFrame(gameLoop);
}

function initSeedCatchPhase() {
  currentPhase = new ItemThrowerPhase({
    canvas,
    ctx,
    scoreLabel: () => `種: ${seedCount}`,
    throwerImage: document.getElementById("img_master"),
    itemConfigList: [
      { type: "seed", image: document.getElementById("img_seed"), weight: 1, initialSpeed: 0.25, acceleration: 0.003, width: 32, height: 32 }
    ],
    maxItems: 35,
    batchCount: 5,
    interval: 1500,
    onCatch: () => seedCount++,
    onComplete: () => {
      phaseManager.advance();
      initPowderCatchPhase();
    }
  });
}

function initPowderCatchPhase() {
  totalPowder = 0;
  currentPhase = new ItemThrowerPhase({
    canvas,
    ctx,
    scoreLabel: () => `粉: ${totalPowder}`,
    throwerImage: document.getElementById("img_elf"),
    itemConfigList: [
      { type: "powder", image: document.getElementById("img_powder"), weight: 60, initialSpeed: 0.08, acceleration: 0.00015 },
      { type: "bluepowder", image: document.getElementById("img_bluepowder"), weight: 20, initialSpeed: 0.08, acceleration: 0.00015 },
      { type: "bottle", image: document.getElementById("img_bottle"), weight: 20, initialSpeed: 0.07, acceleration: 0.0001 }
    ],
    maxItems: 20,
    batchCount: 1,
    interval: 500,
    onCatch: (t) => {
      if (t === "powder") totalPowder += 1;
      else if (t === "bluepowder") totalPowder += 5;
      else if (t === "bottle") totalPowder = Math.max(0, totalPowder - 2);
    },
    onComplete: () => {
      phaseManager.advance();
      initPowderAllocationPhase();
    }
  });
}

function initPowderAllocationPhase() {
  currentPhase = new PowderAllocationPhaseUI(
    canvas,
    ctx,
    seedCount,
    totalPowder,
    (powderLevels) => {
      phaseManager.advance();
      initGrowthPhase(powderLevels);
    },
    document.getElementById("img_light_glow"),
    document.getElementById("img_sparkle"),
    document.getElementById("img_seed")
  );
}

function initGrowthPhase(levels) {
  currentPhase = new GrowthPhaseUI(canvas, ctx, levels, (summary) => {
    phaseManager.advance();
    initResultPhase(summary);
  });
}

function initResultPhase(summary) {
  currentPhase = new ResultPhaseUI(canvas, ctx, summary, () => {
    overlay.style.display = "flex";
    resultUI.style.display = "none";
    sound.stopBgm();
  });
}

/***** 8.  Main Game Loop *****/
function gameLoop(time) {
  const delta = time - lastTimestamp;
  lastTimestamp = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (currentPhase && typeof currentPhase.update === "function") {
    currentPhase.update(delta);
    currentPhase.draw();
  }

  currencyBar.draw();
  requestAnimationFrame(gameLoop);
}
