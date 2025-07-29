import { loadData } from "../utils/loadData.js";

/** 활성화 카테고리 드롭다운 */
export function renderCategoryList(categories, activeCategory) {
  const categoryList = document.getElementById("categoryList");
  const currentCategoryDisplay = document.getElementById("currentCategory");
  categoryList.innerHTML = "";

  categories.forEach(cat => {
    if (cat === "휴지통") return; 
    const catItem = document.createElement("div");
    catItem.className = "category-item";
    catItem.textContent = cat;

    if (cat === activeCategory) {
      catItem.style.fontWeight = "bold";
      catItem.style.color = "green";
      catItem.style.pointerEvents = "none";
    }

    catItem.addEventListener("click", () => {
      chrome.storage.sync.set({ activeCategory: cat }, () => {
        currentCategoryDisplay.textContent = cat;
        loadData();
        categoryList.style.display = "none";
      });
    });

    categoryList.appendChild(catItem);
  });
}


/* 현재 활성화된 카테고리를 확인하여, 링크 저장시 해당 카테고리 드롭다운 */
export function dropDownByActiveCategory() {
  const currentCategoryDisplay = document.getElementById("currentCategory");
  const categoryName = currentCategoryDisplay.textContent.trim(); 

  const activeCategoryHeader = document.querySelector(`[data-category-name="${categoryName}"]`);
  
  if (activeCategoryHeader) {
    const categoryWrapper = activeCategoryHeader.closest(".category-wrapper");
    const urlList = categoryWrapper?.querySelector(".url-list"); 

    if (urlList) {
      urlList.style.display = "block";
      console.log("URL 리스트를 표시했습니다:", urlList);
    } else {
      console.warn(`카테고리 "${categoryName}" 아래에 URL 리스트가 없습니다.`);
    }
  } else {
    console.warn(`카테고리 "${categoryName}"를 찾을 수 없습니다.`);
  }
}