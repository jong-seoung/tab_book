import { styleButton } from "../common/common.js";
import { getUserActive, getSavedUrls } from "../useState.js";
import { notifyOpenAllLimit } from "../user/ProUserNoti.js";

export function createOpenAllButton(category) {
  const btn = document.createElement("button");
  btn.textContent = "전체 열기";
  styleButton(btn, "black");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!getUserActive() && notifyOpenAllLimit()) {
      return;
    }

    const urls = getSavedUrls()[category] || [];

    chrome.runtime.sendMessage({
      type: "OPEN_URLS",
      urls: urls.map((item) => item.url),
    });
  });

  return btn;
}
