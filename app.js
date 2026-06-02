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
const closetSearch = $("#closet-search");
const closetEmpty = $("#closet-empty");
let activeFilter = "all";

const updateCloset = () => {
  const query = closetSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  itemTiles.forEach((tile) => {
    const categoryMatch = activeFilter === "all" || tile.dataset.category === activeFilter;
    const text = tile.textContent.toLowerCase();
    const meta = `${tile.dataset.itemName} ${tile.dataset.itemMeta}`.toLowerCase();
    const queryMatch = !query || text.includes(query) || meta.includes(query);
    const visible = categoryMatch && queryMatch;

    tile.classList.toggle("hidden", !visible);
    if (visible) {
      visibleCount += 1;
    }
  });

  closetEmpty.classList.toggle("hidden", visibleCount > 0);
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    updateCloset();
  });
});

closetSearch.addEventListener("input", updateCloset);

$("#reset-closet").addEventListener("click", () => {
  activeFilter = "all";
  closetSearch.value = "";
  filterButtons.forEach((item) => {
    const active = item.dataset.filter === "all";

    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
  });
  updateCloset();
});

const aiButtons = $$("[data-ai-panel]");
const aiPanels = $$("[data-panel]");

aiButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.dataset.aiPanel;

    aiButtons.forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
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
  sheets.forEach((sheet) => {
    sheet.classList.remove("show");
    sheet.setAttribute("aria-hidden", "true");
    sheet.inert = true;
  });
};

const openSheet = (sheetId) => {
  const sheet = $(`#${sheetId}`);
  if (!sheet) return;

  sheets.forEach((item) => {
    const active = item === sheet;

    item.classList.toggle("show", active);
    item.setAttribute("aria-hidden", active ? "false" : "true");
    item.inert = !active;
  });
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

$("#apply-routine").addEventListener("click", () => {
  const occasion = $("#routine-occasion").value;
  const presence = $("#routine-presence").value;
  const occasionPill = contextButtons[1];
  const timePill = contextButtons[2];

  occasionPill.querySelector("strong").textContent = occasion;
  timePill.querySelector("span").textContent = presence;
  closeSheet();
  setOutfit(occasion === "周末展览" ? 2 : occasion === "晚间聚餐" ? 1 : 0);
  showToast("已按今日偏好刷新推荐");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSheet();
  }
});
