import { styleButton } from "../common/common.js";
import { showCustomConfirm } from "../common/confirm.js";
import { getSavedUrls, setSavedUrls } from "../useState.js";
import { openUrlListByCategory } from "../common/afterEvent.js";
import { t } from "../i18n/i18n.js";

export function createDeleteAllButton(category) {
  const btn = document.createElement("button");
  btn.textContent = t("deleteAll");
  styleButton(btn, "black");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    showCustomConfirm(
      t("deleteAllConfirm", { category }),
      (isConfirmed) => {
        if (isConfirmed) {
          deleteAllUrls(category);
        }
      }
    );
  });

  return btn;
}

function deleteAllUrls(category) {
  const savedUrls = JSON.parse(JSON.stringify(getSavedUrls())); // 깊은 복사
  const deletedUrls = savedUrls[category] || [];
  const trashUrls = savedUrls["휴지통"] || [];

  // beforeCategory 기록
  deletedUrls.forEach(el => el["beforeCategory"] = category);

  // 휴지통에 추가
  savedUrls["휴지통"] = [...trashUrls, ...deletedUrls];
  savedUrls[category] = []; // 선택 카테고리 비우기

  setSavedUrls(savedUrls);

  chrome.storage.sync.set({ savedUrls }, () => {
    openUrlListByCategory(category);
  });
}
