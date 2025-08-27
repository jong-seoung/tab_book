import { getSavedUrls, setSavedUrls } from "../useState.js";
import { renderUrls } from "../saveurl/renderUrls.js";
import { styleButton } from "../common/common.js";
import { showCustomConfirm } from "../common/confirm.js";

export function createTrashCategory() {
  const trashCategoryContainer = document.getElementById(
    "trashCategoryContainer"
  );

  trashCategoryContainer.innerHTML = "";

  const trashWrapper = createTrashWrapper();
  trashCategoryContainer.appendChild(trashWrapper);
}

function createTrashWrapper() {
  const wrapper = document.createElement("div");
  wrapper.className = "trashCategory-wrapper";
  wrapper.style.marginLeft = "10px";
  wrapper.style.marginBottom = "3px";

  const header = createTrashCategoryHeader();
  const urlList = renderUrls("휴지통");

  header.addEventListener("click", () => {
    urlList.style.display =
      urlList.style.display === "block" ? "none" : "block";
  });

  wrapper.append(header, urlList);
  return wrapper;
}

function createTrashCategoryHeader() {
  const header = document.createElement("div");
  header.className = "category-header trash-header";
  header.dataset.category = "휴지통";

  const title = document.createElement("span");
  title.textContent = "휴지통";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "category-buttons";

  const trashBtn = trashDeleteAllButton();
  buttonsDiv.append(trashBtn);

  header.append(title, buttonsDiv);
  return header;
}

function trashDeleteAllButton() {
  const btn = document.createElement("button");
  btn.textContent = "비우기";
  styleButton(btn, "gray");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showCustomConfirm(
      "휴지통을 비웁니다.<br>복원이 불가능합니다.",
      (confirmation) => {
        if (confirmation) {
          emptyTrash(); // 확인 클릭 시 휴지통 비우기
        }
      }
    );
  });

  return btn;
}

function emptyTrash() {
  const savedUrls = { ...getSavedUrls() };
  savedUrls["휴지통"] = [];
  setSavedUrls(savedUrls);
  chrome.storage.sync.set({ savedUrls: savedUrls }, () => {});
}
