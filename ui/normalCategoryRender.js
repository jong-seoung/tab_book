// import { getUserVersion } from "../storage/userStorage.js";
import { getUserVersion } from "../storage/userStorage.js";
import { getUrlsByCategory, deleteAllUrls } from "../storage/urlStorage.js";
import { styleButton } from "./common.js";
import { showCustomAlert, showCustomConfirm, showCustomPrompt } from "../utils/customDialogs.js";
import { attachCategoryDragAndDrop } from "../utils/categoryDragDrop.js";
import { createNormalUrlList } from "./urlListRender.js";
import { createSettingButton } from "./categorySettingRender.js";

export function renderNormalCategories(categories, savedUrls, activeCategory) {
  const categoryContainer = document.getElementById("categoryContainer");
  categoryContainer.innerHTML = "";
  
  categories
    .filter(cat => cat !== "휴지통")
    .forEach((cat) => {
      const catWrapper = createNormalCategoryWrapper(cat, savedUrls[cat] || []);
      categoryContainer.appendChild(catWrapper);
    });

  const dummyWrapper = document.createElement("div");
  dummyWrapper.className = "category-wrapper dummy-category-wrapper";
  attachCategoryDragAndDrop(dummyWrapper, null);

  categoryContainer.appendChild(dummyWrapper);
}

export function renderMoveSingleCategory(categoryName, savedUrls) {
  const categoryContainer = document.getElementById("categoryContainer");

  const oldWrapper = Array.from(categoryContainer.children).find(child => {
    return child.querySelector(".category-header span")?.textContent === categoryName;
  });

  const newWrapper = createNormalCategoryWrapper(categoryName, savedUrls);

  categoryContainer.replaceChild(newWrapper, oldWrapper);
}

export function createNormalCategoryWrapper(categoryName, urls) {
  const wrapper = document.createElement("div");
  wrapper.className = "category-wrapper";

  const header = createNormalCategoryHeader(categoryName);
  const urlList = createNormalUrlList(categoryName, urls);

  header.addEventListener("click", () => {
    urlList.style.display = urlList.style.display === "block" ? "none" : "block";
  });

  wrapper.append(header, urlList);
  return wrapper;
}

function createNormalCategoryHeader(categoryName) {
  const header = document.createElement("div");
  header.className = "category-header";
  header.draggable = true;
  header.dataset.categoryName = categoryName;

  const title = document.createElement("span");
  title.textContent = categoryName;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "category-buttons";

  attachCategoryDragAndDrop(header, categoryName);

  const allBtn = createAllOpenButton(categoryName);
  const deleteAllBtn = deleteAllButton(categoryName);
  const settingBtn = createSettingButton(categoryName);

  const categoryDiv = document.createElement("div");
  categoryDiv.append(title, settingBtn)

  const allBtnDiv = document.createElement("div");
  allBtnDiv.append(allBtn, deleteAllBtn)

  header.append(categoryDiv, allBtnDiv);
  return header;
}

function deleteAllButton(categoryName) {
  const btn = document.createElement("button");
  btn.textContent = "전체 삭제";
  styleButton(btn, "black");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    showCustomConfirm(`"${categoryName}" 카테고리의 </br> 모든 링크를 삭제합니다.`, (isConfirmed) => {
      if (isConfirmed) {
        console.log("삭제가 확인되었습니다.");
        deleteAllUrls(categoryName);
      } else {
        console.log("삭제가 취소되었습니다.");
      }
    });
  });

  return btn;
}

function createAllOpenButton(categoryName) {
  const btn = document.createElement("button");
  btn.textContent = "전체 열기";
  styleButton(btn, "black");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  getUserVersion((isPaidUser) => {
    if (categoryName !== "기본" && !isPaidUser) {
      showCustomAlert("무료 버전에서는 '전체 열기' 기능이 기본 카테고리로 제한됩니다.");
      return;
    }

    getUrlsByCategory(categoryName, (urls) => {
      urls.forEach(item => window.open(item.url, '_blank'));
    });
  });
});

  return btn;
}
