import { addUrlToActiveCategory } from "./src/saveurl/urlsCRUD.js";
import { initLocale, t } from "./src/i18n/i18n.js";

initLocale();

// 백그라운드에서 동작하는 단축키
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-popup") {
    chrome.action.openPopup().catch(() => {});
  } else if (command === "open-all-tabs") {
    chrome.storage.local.set({ pendingOpenAll: true }, () => {
      chrome.action.openPopup().catch(() => {
        chrome.storage.local.remove("pendingOpenAll");
      });
    });
  } else if (command === "save-current-tab" || command === "save-all-tabs") {
    chrome.storage.sync.get(["savedUrls", "activeCategory", "quickSave"], (data) => {
      const quickSave = data.quickSave !== false; // 기본값 true

      const queryOptions = command === "save-current-tab"
        ? { active: true, currentWindow: true }
        : { currentWindow: true };

      chrome.tabs.query(queryOptions, (tabs) => {
        if (quickSave) {
          // Quick Save ON: 기존 동작 (활성화 카테고리에 바로 저장)
          addUrlToActiveCategory(data, tabs, true);
          const message = command === "save-current-tab"
            ? t("savedToCategory", { category: data.activeCategory })
            : t("savedTabsToCategory", { count: tabs.length, category: data.activeCategory });
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: t("saveComplete"),
            message,
            priority: 2,
          });
        } else {
          // Quick Save OFF: 탭 정보를 임시 저장 후 확장프로그램 팝업 열기
          const pendingTabs = tabs.map((tab) => ({ title: tab.title, url: tab.url }));
          chrome.storage.local.set({ pendingTabs }, () => {
            chrome.action.openPopup().catch(() => {
              // openPopup 실패 시 별도 창으로 fallback
              chrome.windows.create({
                url: `src/categoryPicker/categoryPicker.html?command=${command}`,
                type: "popup",
                width: 320,
                height: 400,
              });
            });
          });
        }
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NOTIFY") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: message.title,
      message: message.message,
      priority: 2,
    });
  } else if (message.type === "OPEN_URLS") {
    message.urls.forEach((url) => {
      chrome.tabs.create({ url });
    });
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: t("openAllComplete"),
      message: t("openedTabsCount", { count: message.urls.length }),
      priority: 2,
    });
  }
});
