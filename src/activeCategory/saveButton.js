import { addUrlToActiveCategory } from "../saveurl/urlsCRUD.js";

// Button to save URLs
export function setUpAddUrlButton() {
  const saveTab = document.getElementById("save-tab");
  const saveTabs = document.getElementById("save-tabs");

  saveTab.addEventListener("click", () => {
    chrome.storage.sync.get(["savedUrls", "activeCategory"], (data) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        addUrlToActiveCategory(data, tabs);
      });
    });
  });

  saveTabs.addEventListener("click", () => {
    chrome.storage.sync.get(["savedUrls", "activeCategory"], (data) => {
      chrome.tabs.query({}, (tabs) => {
        addUrlToActiveCategory(data, tabs);
      });
    });
  });
}
