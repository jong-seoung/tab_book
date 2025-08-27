import { styleButton } from "../common/common.js";
import { showCustomConfirm } from "../common/confirm.js";
import { getSavedUrls, setSavedUrls } from "../useState.js";
import { openUrlListByCategory } from "../common/afterEvent.js";

export function createDeleteAllButton(category) {
  const btn = document.createElement("button");
  btn.textContent = "전체 삭제";
  styleButton(btn, "black");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    showCustomConfirm(
      `"${category}" 카테고리의 </br> 모든 링크를 삭제합니다.`,
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
  const savedUrls = getSavedUrls();
  const deletedUrls = savedUrls[category] || [];
  const trashUrls = savedUrls["휴지통"] || [];

  deletedUrls.forEach((element) => {
    element["beforeCategory"] = category;
  });

  const updatedTrash = [...trashUrls, ...deletedUrls];

  setSavedUrls({ ...getSavedUrls(), ["휴지통"]: updatedTrash, [category]: [] });

  chrome.storage.sync.set({ savedUrls: getSavedUrls() }, () => {
    openUrlListByCategory(category);
  });
}
