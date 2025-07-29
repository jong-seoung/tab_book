import { saveUrlsToActiveCategory } from "./utils/saveItem.js";

// 백그라운드에서 동작하는 단축키
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-popup") {
    chrome.action.openPopup();
  } else if (command === "save-current-tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      saveUrlsToActiveCategory(tabs);
    });
  } else if (command === "save-all-tabs") {
    chrome.tabs.query({}, (tabs) => {
      saveUrlsToActiveCategory(tabs);
    });
  }
});