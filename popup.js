// popup.js
import { loadData } from './loadData.js';
import { initLocale, applyI18nToDOM } from './src/i18n/i18n.js';

// 초기 데이터 로딩
document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const content = document.getElementById("main-content");

  try {
    await initLocale();
    applyI18nToDOM();
    loadData();
    loadShortcuts();
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
  } finally {
    loading.style.display = "none";
    content.style.display = "block";
  }
});

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
