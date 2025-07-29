import { loadData } from "./loadData.js";

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

//** activeCategory 클릭 시 드롭다운 표시 **//
export function setupActiveCategoryDropdown() {
  const categoryList = document.getElementById("categoryList");
  const activeCategoryDisplay = document.getElementById("activeCategory");

  activeCategoryDisplay.addEventListener("click", () => {
    categoryList.style.display = categoryList.style.display === "block" ? "none" : "block";
  });

}
