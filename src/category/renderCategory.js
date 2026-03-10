import { getCategories, getSavedUrls } from "../useState.js";
import { attachCategoryDragAndDrop } from "../common/dragDropToCategoryAndUrls.js";
import { createDeleteAllButton } from "./deleteAllButton.js";
import { createOpenAllButton } from "./openAllButton.js";
import { createSettingButton } from "./settingButton.js";
import { addCategory } from "./categoryCRUD.js";
import { renderUrls } from "../saveurl/renderUrls.js";
import { t, translateCategoryName } from "../i18n/i18n.js";

// category render
export function renderCategories() {
  const categories = getCategories();
  const savedUrls = getSavedUrls();

  const categoryContainer = document.getElementById("categoryContainer");

  // 현재 열린 카테고리 상태 저장
  const openCategories = new Set();
  categoryContainer.querySelectorAll(".category-header[data-category]").forEach((header) => {
    const urlList = header.nextElementSibling;
    if (urlList?.style.display === "block") {
      openCategories.add(header.dataset.category);
    }
  });

  categoryContainer.innerHTML = "";

  categories
    .filter((category) => category !== "휴지통")
    .forEach((category) => {
      const categoryWrapper = createCategoryWrapper(
        category,
        savedUrls[category] || [],
        openCategories.has(category)
      );
      categoryContainer.appendChild(categoryWrapper);
    });

  const dummyWrapper = document.createElement("div");
  dummyWrapper.className = "category-wrapper dummy-category-wrapper";
  attachCategoryDragAndDrop(dummyWrapper);

  categoryContainer.appendChild(dummyWrapper);
}

function createCategoryWrapper(category, urls, isOpen = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "category-wrapper";

  const header = createCategoryHeader(category, urls);
  wrapper.append(header);

  // URL 리스트 생성
  const urlList = renderUrls(category);
  if (isOpen) urlList.style.display = "block";

  header.addEventListener("click", () => {
    urlList.style.display =
      urlList.style.display === "block" ? "none" : "block";
  });

  wrapper.append(header, urlList);
  return wrapper;
}

function createCategoryHeader(category, urls = []) {
  const header = document.createElement("div");
  header.className = "category-header";
  header.draggable = true;
  header.dataset.category = category;

  const title = document.createElement("span");
  title.textContent = `${translateCategoryName(category)} / ${urls.length}`;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "category-buttons";

  attachCategoryDragAndDrop(header);

  const allBtn = createOpenAllButton(category);
  const deleteAllBtn = createDeleteAllButton(category);
  const settingBtn = createSettingButton(category);

  const categoryDiv = document.createElement("div");
  categoryDiv.style.display = "flex";
  categoryDiv.style.alignItems = "center";
  categoryDiv.style.gap = "4px";
  categoryDiv.append(title, settingBtn);

  const allBtnDiv = document.createElement("div");
  allBtnDiv.append(allBtn, deleteAllBtn);

  header.append(categoryDiv, allBtnDiv);
  return header;
}

// category add button ( + button )
export function createAddCategoryButton() {
  if (document.getElementById("confirmAddCategoryBtn")) {
    return;
  }

  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const newCategoryInput = document.getElementById("newCategoryInput");
  const newCategoryInputField = document.getElementById("newCategory");

  const confirmAddCategoryBtn = document.createElement("button");
  confirmAddCategoryBtn.textContent = t("add");
  confirmAddCategoryBtn.id = "confirmAddCategoryBtn";
  confirmAddCategoryBtn.style.display = "none";
  newCategoryInput.appendChild(confirmAddCategoryBtn);

  // 입력 박스 활성화
  addCategoryBtn.addEventListener("click", () => {
    newCategoryInput.style.display = "block";
    newCategoryInputField.focus();
    addCategoryBtn.style.display = "none";
    confirmAddCategoryBtn.style.display = "inline-block";
  });

  newCategoryInputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && newCategoryInputField.value.trim() !== "") {
      addCategory(newCategoryInputField.value.trim());
      displayNone();
    }
  });

  confirmAddCategoryBtn.addEventListener("click", () => {
    if (newCategoryInputField.value.trim() !== "") {
      addCategory(newCategoryInputField.value.trim());
      displayNone();
    }
  });

  // 입력 박스 비 활성화
  function displayNone() {
    newCategoryInput.style.display = "none";
    addCategoryBtn.style.display = "block";
    confirmAddCategoryBtn.style.display = "none";
    newCategoryInputField.value = "";
  }

  // 클릭 이벤트가 입력 박스 외부에서 발생했을 때 입력 박스 비활성화
  document.addEventListener("click", (event) => {
    const isClickInside =
      newCategoryInput.contains(event.target) ||
      addCategoryBtn.contains(event.target);
    if (!isClickInside) {
      displayNone();
    }
  });
}
