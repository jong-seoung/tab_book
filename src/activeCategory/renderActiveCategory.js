import { getCategories, getActiveCategory } from "../useState.js";
import { changeActiveCategory } from "../category/categoryCRUD.js";
import { translateCategoryName } from "../i18n/i18n.js";

export function renderActiveCategory() {
  const currentCategoryDisplay = document.getElementById("currentCategory");
  const categoryList = document.getElementById("categoryList");

  categoryList.innerHTML = "";

  const categories = getCategories();
  const activeCategory = getActiveCategory();

  categories.forEach((category) => {
    if (category === "휴지통") return;

    const categoryItem = document.createElement("div");
    categoryItem.className = "category-item";
    categoryItem.textContent = translateCategoryName(category);

    // 활성화 카테고리 디자인
    if (category === activeCategory) {
      currentCategoryDisplay.textContent = translateCategoryName(activeCategory);
      categoryItem.style.fontWeight = "bold";
      categoryItem.style.color = "green";
      categoryItem.style.pointerEvents = "none";
    }

    // 활성화 카테고리 클릭으로 변경
    categoryItem.addEventListener("click", () => {
      changeActiveCategory(category);
      categoryList.style.display = "none";
    });

    categoryList.appendChild(categoryItem);
  });
}

export function initCategoryDropdownEvent() {
  const dropdown = document.getElementById("activeCategory");
  // 드롭다운 이벤트
  dropdown.addEventListener("click", () => {
    categoryList.style.display =
      categoryList.style.display === "block" ? "none" : "block";
  });
}
