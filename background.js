import { addUrlToActiveCategory } from "./src/saveurl/urlsCRUD.js";

// 백그라운드에서 동작하는 단축키
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-popup") {
    chrome.action.openPopup();
  } else if (command === "save-current-tab") {
    chrome.storage.sync.get(["savedUrls", "activeCategory"], (data) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        addUrlToActiveCategory(data, tabs, true);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "저장 완료",
          message: `${data.activeCategory}카테고리에 저장되었습니다.`,
          priority: 2,
        });
      });
    });
  } else if (command === "save-all-tabs") {
    chrome.storage.sync.get(["savedUrls", "activeCategory"], (data) => {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        addUrlToActiveCategory(data, tabs, true);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "저장 완료",
          message: `${tabs.length}개의 탭이 ${data.activeCategory}에 저장되었습니다.`,
          priority: 2,
        });
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_URLS") {
    message.urls.forEach((url) => {
      chrome.tabs.create({ url });
    });
  }
});
