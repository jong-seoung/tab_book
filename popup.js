// popup.js
import { loadData } from './utils/loadData.js';
import { renderHeaderWithTooltip } from "./ui/toolTipRender.js";
import { syncSubscriptionStatus, checkUserSubscription } from "./storage/userStorage.js"

// refactor
import { setupActiveCategoryDropdown } from "./utils/activeCategory.js";
import { setupSaveItems, setupSaveItemsWithShortcut } from './utils/saveItem.js';
import { setupAddCategory } from "./utils/category.js";


// 초기 데이터 로딩
document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const content = document.getElementById("main-content");

  try {
    if (!checkUserSubscription()){
      await syncSubscriptionStatus();
    }
    loadData();
    renderHeaderWithTooltip();
    setupSaveItemsWithShortcut();
    setupActiveCategoryDropdown();
    setupSaveItems();
    setupAddCategory();
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
  } finally {
    loading.style.display = "none";
    content.style.display = "block";
  }
});

// 백그라운드 커맨드로 DOM 업데이트 하기 위한 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CATEGORY_UPDATED") {
      try {
        loadData(true);
      } catch (error) {
        console.error("Error updating DOM:", error);
      }
  }
});