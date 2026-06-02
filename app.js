const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

const navButtons = $$(".bottom-nav button");
const screens = $$(".screen");
const toast = $(".toast");

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    navButtons.forEach((item) => item.classList.toggle("active", item === button));
    screens.forEach((screen) => {
      const active = screen.dataset.screen === target;
      screen.classList.toggle("active", active);
      if (active) {
        screen.scrollTop = 0;
      }
    });
  });
});

const contextButtons = $$(".context-pill");

contextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    contextButtons.forEach((item) => item.classList.toggle("active", item === button));
  });
});

const outfitData = [
  {
    title: "灰短夹克 / 白 T / 深蓝直筒裤",
    score: "94",
    note: "深色下装平衡比例，外套 12 天未穿。",
    image: "./assets/hero-outfit.png",
  },
  {
    title: "黑针织 / 灰西裤 / 黑色乐福鞋",
    score: "91",
    note: "正式度更高，适合下午对外会议。",
    image: "./assets/outfit-evening.png",
  },
  {
    title: "牛仔衬衫 / 卡其裤 / 白鞋",
    score: "87",
    note: "更松弛，适合无正式会议的工作日。",
    image: "./assets/outfit-weekend.png",
  },
];

const outfitTitle = $("#main-outfit-title");
const outfitImage = $("#hero-outfit-image");
const scoreValue = $(".score-chip strong");
const insightCopy = $(".insight-band p");
const outfitRows = $$(".outfit-row");
const refreshButton = $("#refresh-outfit");
let currentOutfit = 0;

const setOutfit = (index) => {
  currentOutfit = index;
  const outfit = outfitData[index];

  outfitTitle.textContent = outfit.title;
  outfitImage.src = outfit.image;
  scoreValue.textContent = outfit.score;
  insightCopy.textContent = outfit.note;
  outfitRows.forEach((row) => row.classList.toggle("active", Number(row.dataset.outfit) === index));
};

outfitRows.forEach((row) => {
  row.addEventListener("click", () => setOutfit(Number(row.dataset.outfit)));
});

refreshButton.addEventListener("click", () => {
  setOutfit((currentOutfit + 1) % outfitData.length);
  showToast("已切换下一套推荐");
});

$("#wear-today").addEventListener("click", () => {
  showToast("已记录今天穿搭");
});

const filterButtons = $$("[data-filter]");
const itemTiles = $$(".item-tile");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    itemTiles.forEach((tile) => {
      tile.classList.toggle("hidden", filter !== "all" && tile.dataset.category !== filter);
    });
  });
});

const aiButtons = $$("[data-ai-panel]");
const aiPanels = $$("[data-panel]");

aiButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.dataset.aiPanel;

    aiButtons.forEach((item) => item.classList.toggle("active", item === button));
    aiPanels.forEach((item) => item.classList.toggle("active", item.dataset.panel === panel));
  });
});

const candidateButtons = $$(".candidate-row button");
const replaceTitle = $("#replace-title");
const pantsOverlay = $(".pants-overlay");

const overlayColors = {
  卡其休闲裤: "rgba(177, 151, 104, 0.62)",
  深蓝直筒裤: "rgba(23, 45, 70, 0.58)",
  米白针织: "rgba(228, 218, 200, 0.62)",
};

candidateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.replace;

    candidateButtons.forEach((item) => item.classList.toggle("selected", item === button));
    replaceTitle.textContent = name;
    pantsOverlay.style.background = overlayColors[name];
  });
});

$("#preview-btn").addEventListener("click", () => {
  showToast(`${replaceTitle.textContent}预览已生成`);
});

const backdrop = $(".sheet-backdrop");
const sheets = $$(".sheet");

const closeSheet = () => {
  backdrop.classList.remove("show");
  sheets.forEach((sheet) => sheet.classList.remove("show"));
};

const openSheet = (sheetId) => {
  const sheet = $(`#${sheetId}`);
  if (!sheet) return;

  sheets.forEach((item) => item.classList.toggle("show", item === sheet));
  backdrop.classList.add("show");
};

$$("[data-sheet]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const sheetId = trigger.dataset.sheet;

    if (sheetId === "item-sheet") {
      $("#item-sheet-name").textContent = trigger.dataset.itemName;
      $("#item-sheet-meta").textContent = trigger.dataset.itemMeta;
      $("#item-sheet-price").textContent = trigger.dataset.itemPrice;
      $("#item-sheet-score").textContent = trigger.dataset.itemScore;
      $("#item-sheet-cloth").className = trigger.querySelector(".cloth").className;
    }

    if (sheetId === "outfit-sheet") {
      $("#outfit-sheet-name").textContent = trigger.dataset.outfitName;
      $("#outfit-sheet-meta").textContent = trigger.dataset.outfitMeta;
      $("#outfit-sheet-score").textContent = trigger.dataset.outfitScore;
      $("#outfit-sheet-image").src = trigger.dataset.outfitImage;
    }

    if (sheetId === "confirm-sheet") {
      $("#confirm-name").textContent = trigger.dataset.detectName;
      $("#confirm-type").value = trigger.dataset.detectType;
      $("#confirm-confidence").value = trigger.dataset.detectConfidence;
    }

    openSheet(sheetId);
  });
});

$$("[data-close-sheet]").forEach((control) => {
  control.addEventListener("click", closeSheet);
});

$$("[data-capture-action]").forEach((button) => {
  button.addEventListener("click", () => {
    closeSheet();
    showToast(`已进入${button.dataset.captureAction}录入流程`);
  });
});

$("[data-confirm-all]").addEventListener("click", () => {
  showToast("4 件单品已确认入库");
});

$("[data-confirm-one]").addEventListener("click", () => {
  closeSheet();
  showToast(`${$("#confirm-name").textContent}已确认`);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSheet();
  }
});
