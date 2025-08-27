import { styleButton } from "../common/common.js";
import { getUserActive, getSavedUrls } from "../useState.js";

export function createOpenAllButton(categoryName) {
  const btn = document.createElement("button");
  btn.textContent = "전체 열기";
  styleButton(btn, "black");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const userActive = getUserActive();

    if (categoryName !== "기본" && !userActive) {
      alert("무료 버전에서는 '전체 열기' 기능이 기본 카테고리로 제한됩니다.");
      return;
    }

    const urls = getSavedUrls()[categoryName] || [];

    chrome.runtime.sendMessage({
      type: "OPEN_URLS",
      urls: urls.map((item) => item.url),
    });
  });

  return btn;
}
