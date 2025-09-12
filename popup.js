// popup.js
import { loadData } from './loadData.js';

// 초기 데이터 로딩
document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const content = document.getElementById("main-content");

  try {
    loadData();
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
        loadData();
      } catch (error) {
        console.error("Error updating DOM:", error);
      }
  }
});