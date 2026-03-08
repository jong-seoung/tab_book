import { showCustomAlert } from "../common/confirm.js";
import { getSavedUrls, getActiveCategory } from "../useState.js";
import { t } from "../i18n/i18n.js";

// 카테고리 3개 제한 알림
export function notifyCategoryLimitReached() {
  const savedUrls = getSavedUrls();
  if (Object.keys(savedUrls).length > 3) {
    showCustomAlert(t("categoryLimit"));
    const newCategoryInput = document.getElementById("newCategoryInput");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
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
      t("urlLimit"),
      t("urlSaveFailed"),
      "src/public/warning.webp"
    );
    return true;
  }
  return false;
}

// 전체 열기 제한 (프로 전용)
export function notifyOpenAllLimit(category) {
  if (category !== "기본") {
    showCustomAlert(t("openAllLimit"));
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
