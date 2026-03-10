// popup.js
import { loadData } from './loadData.js';
import { initLocale, applyI18nToDOM, t, translateCategoryName } from './src/i18n/i18n.js';

// 초기 데이터 로딩
document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const content = document.getElementById("main-content");
  const picker = document.getElementById("category-picker");
  const openAllPicker = document.getElementById("open-all-picker");

  try {
    await initLocale();
    applyI18nToDOM();
    chrome.storage.sync.get(["darkMode"], (result) => {
      if (result.darkMode === true) document.body.classList.add("dark-mode");
    });

    const localData = await new Promise((resolve) => {
      chrome.storage.local.get(["pendingTabs", "pendingOpenAll"], resolve);
    });

    if (localData.pendingTabs && localData.pendingTabs.length > 0) {
      const pendingTabs = localData.pendingTabs;
      chrome.storage.local.remove("pendingTabs");
      loading.style.display = "none";
      picker.style.display = "block";
      renderCategoryPicker(pendingTabs);
      return;
    }

    if (localData.pendingOpenAll) {
      chrome.storage.local.remove("pendingOpenAll");
      loading.style.display = "none";
      openAllPicker.style.display = "block";
      renderOpenAllPicker();
      return;
    }

    loadData();
    loadShortcuts();
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
  } finally {
    loading.style.display = "none";
    if (picker.style.display === "none" && openAllPicker.style.display === "none") {
      content.style.display = "block";
    }
  }
});

function renderCategoryPicker(pendingTabs) {
  document.getElementById("picker-title").textContent = t("selectCategory");
  document.getElementById("picker-tooltip1").textContent = t("quickSaveTooltip_1");
  document.getElementById("picker-tooltip2").textContent = t("quickSaveTooltip_2");

  chrome.storage.sync.get(["categories"], (data) => {
    const categories = (data.categories || []).filter((c) => c !== "휴지통");
    const container = document.getElementById("picker-list");

    categories.forEach((category) => {
      const btn = document.createElement("button");
      btn.textContent = translateCategoryName(category);
      btn.style.cssText = "width:100%;padding:10px 14px;border-radius:8px;border:1px solid #ccc;background:transparent;font-size:14px;cursor:pointer;text-align:left;transition:background 0.15s;";
      btn.addEventListener("mouseenter", () => btn.style.backgroundColor = "rgba(0,0,0,0.06)");
      btn.addEventListener("mouseleave", () => btn.style.backgroundColor = "transparent");
      btn.addEventListener("click", () => savePendingToCategory(category, pendingTabs));
      container.appendChild(btn);
    });
  });
}

function savePendingToCategory(category, pendingTabs) {
  chrome.storage.sync.get(["savedUrls"], (syncData) => {
    const savedUrls = syncData.savedUrls || {};
    const categoryUrls = savedUrls[category] || [];

    pendingTabs.forEach((tab) => {
      const exists = categoryUrls.some((item) => item.url === tab.url && item.title === tab.title);
      if (!exists) categoryUrls.push({ title: tab.title, url: tab.url });
    });

    savedUrls[category] = categoryUrls;

    chrome.storage.sync.set({ savedUrls }, () => {
      const message = pendingTabs.length === 1
        ? t("savedToCategory", { category })
        : t("savedTabsToCategory", { count: pendingTabs.length, category });
      chrome.runtime.sendMessage({
        type: "NOTIFY",
        title: t("saveComplete"),
        message,
      });
      window.close();
    });
  });
}

function renderOpenAllPicker() {
  document.getElementById("open-all-title").textContent = t("openAllShortcut");
  document.getElementById("open-all-tooltip1").textContent = t("openAllTooltip_1");
  document.getElementById("open-all-tooltip2").textContent = t("openAllTooltip_2");

  chrome.storage.sync.get(["categories", "savedUrls"], (data) => {
    const categories = (data.categories || []).filter((c) => c !== "휴지통");
    const savedUrls = data.savedUrls || {};
    const container = document.getElementById("open-all-list");

    categories.forEach((category) => {
      const urls = (savedUrls[category] || []).map((item) => item.url);
      if (urls.length === 0) return;

      const btn = document.createElement("button");
      btn.textContent = `${translateCategoryName(category)} (${urls.length})`;
      btn.style.cssText = "width:100%;padding:10px 14px;border-radius:8px;border:1px solid #ccc;background:transparent;font-size:14px;cursor:pointer;text-align:left;transition:background 0.15s;";
      btn.addEventListener("mouseenter", () => btn.style.backgroundColor = "rgba(0,0,0,0.06)");
      btn.addEventListener("mouseleave", () => btn.style.backgroundColor = "transparent");
      btn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "OPEN_URLS", urls });
        window.close();
      });
      container.appendChild(btn);
    });
  });
}

function loadShortcuts() {
  chrome.commands.getAll((commands) => {
    const map = { "save-current-tab": "shortcut-save-tab", "save-all-tabs": "shortcut-save-tabs" };
    for (const cmd of commands) {
      const elId = map[cmd.name];
      if (elId && cmd.shortcut) {
        document.getElementById(elId).textContent = cmd.shortcut;
      }
    }
  });
}

// 백그라운드 커맨드로 DOM 업데이트 하기 위한 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CATEGORY_UPDATED") {
      try {
        loadData();
      } catch (error) {
        console.error("Error updating DOM:", error);
      }
  }
});
