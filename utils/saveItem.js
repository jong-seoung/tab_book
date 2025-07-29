import { getUserVersion } from "../storage/userStorage.js";
import { dropDownByActiveCategory } from "../ui/activeCategoryRender.js";
import { loadData } from "./loadData.js";

// ** 버튼을 클릭하여, 현재 활성화된 카테고리에 탭을 저장 **//
export function setupSaveItems() {
    const saveTab = document.getElementById("save-tab");
    const saveTabs = document.getElementById("save-tabs");

    saveTab.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        saveUrlsToActiveCategory(tabs, false).then(() => {
          loadData(true);  
        }).catch(console.warn);
    });
    });

    saveTabs.addEventListener("click", () => {
    chrome.tabs.query({}, (tabs) => {
        saveUrlsToActiveCategory(tabs, false).then(() => {
        loadData(true);  
        }).catch(console.warn);
    });
    });
}

// ** 단축키를 표시해주는 기능 **//
export async function setupSaveItemsWithShortcut() {
    const saveTabLabel = document.querySelector("#save-tab > div:first-child");
    const saveTabsLabel = document.querySelector("#save-tabs > div:first-child");

    chrome.commands.getAll((commands) => {
        const shortcuts = {};
        commands.forEach(cmd => {
        if (cmd.name === "save-current-tab") {
            shortcuts.saveCurrentTab = cmd.shortcut || "Alt+S"; 
        }
        if (cmd.name === "save-all-tabs") {
            shortcuts.saveAllTabs = cmd.shortcut || "Alt+Shift+S";
        }
        });

        if (shortcuts.saveCurrentTab) {
        saveTabLabel.textContent = shortcuts.saveCurrentTab;
        }

        if (shortcuts.saveAllTabs) {
            saveTabsLabel.textContent = shortcuts.saveAllTabs;
        }
    });
    }


// ** 탭 목록을 받아, 활성화된 카테고리에 저장하는 로직 **//
export function saveUrlsToActiveCategory(tabs, shouldNotifyUI = true) {
  return new Promise((resolve, reject) => {
    getUserVersion((isPro) => {
      chrome.storage.sync.get(["activeCategory", "savedUrls"], (data) => {
        const category = data.activeCategory || "기본";
        const saved = data.savedUrls || {};
        saved[category] = saved[category] || [];

        if (!isPro && saved[category].length >= 7) {
          showChromeNotification("무료 버전에서는 최대 7개까지만 링크를 저장할 수 있습니다.", "링크 저장 실패", "warning.webp");
          return reject("무료 버전 제한");
        }

        tabs.forEach(tab => {
          const alreadySaved = saved[category].some(item => item.url === tab.url);
          if (!alreadySaved) {
            saved[category].push({ title: tab.title, url: tab.url });
          }
        });

        chrome.storage.sync.set({ savedUrls: saved }, () => {
          showChromeNotification(`"${category}" 카테고리에 저장했습니다.`, "링크 저장 완료!", "icons/icon32.png");

          if (shouldNotifyUI) {
            chrome.runtime.sendMessage({
              type: "CATEGORY_UPDATED",
              payload: {
                category,
                urls: saved[category],
              },
            }).catch((err) => {
              if (err.message.includes("Receiving end does not exist")) {
                console.log("팝업이 안 떠 있어서 메시지 무시함");
              } else {
                console.error("알 수 없는 메시지 오류:", err);
              }
            });
          }

          resolve();
        });
      });
    });
  });
}


function showChromeNotification(message, title, icon) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: icon,
    title: title,
    message: message,
  });
}