import { showCustomAlert } from "../common/confirm.js";
import { getSavedUrls, getActiveCategory } from "../useState.js";

// 카테고리 3개 제한 알림
export function notifyCategoryLimitReached() {
  const savedUrls = getSavedUrls();
  if (Object.keys(savedUrls).length > 3) {
    showCustomAlert(
      "무료 버전에서는 최대 3개의 <br>카테고리만 추가할 수 있습니다."
    );
    newCategoryInput.style.display = "none";
    addCategoryBtn.style.display = "block";
    return true;
  }
  return false;
}

// URL 7개 제한 알림
export function notifyUrlLimitReached(data, tabs) {
  const activeCategory = data.activeCategory || getActiveCategory();

  const savedUrls = getSavedUrls()[activeCategory] || data.savedUrls[activeCategory] || {};

  const tabsList = tabs || [];

  if (savedUrls.length + tabsList.length > 7) {
    showChromeNotification(
      "무료 버전에서는 최대 7개까지만 링크를 저장할 수 있습니다.",
      "링크 저장 실패",
      "src/public/warning.webp"
    );
    return true;
  }
  return false;
}

// 전체 열기 제한 (프로 전용)
export function notifyOpenAllLimit(category) {
  if (category !== "기본") {
    showCustomAlert(
      "무료 버전에서는 '전체 열기' 기능이 기본 카테고리로 제한됩니다."
    );
    return true;
  }
  return false;
}

function showChromeNotification(message, title, icon) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: icon,
    title: title,
    message: message,
  });
}
