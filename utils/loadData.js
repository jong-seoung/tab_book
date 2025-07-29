// import { renderCategories } from "../ui/normalCategoryRender.js";
import { renderCategoryList } from "../ui/activeCategoryRender.js";
import { renderTrashCategory, createTrashCategoryWrapper } from "../ui/trashCategoryRender.js"; 
import { renderNormalCategories } from "../ui/normalCategoryRender.js"; 
import { dropDownByActiveCategory } from "../ui/activeCategoryRender.js";

export function loadData(dropdown=false) {
  chrome.storage.sync.get(["categories", "savedUrls", "activeCategory"], (data) => {
    let categories = data.categories || [];
    let savedUrls = data.savedUrls || {};
    let activeCategory = data.activeCategory || "기본";

    if (categories.length === 0) {
      categories = ["기본", "휴지통"];
      chrome.storage.sync.set({ categories });
    }

    if (!categories.includes(activeCategory)) {
      activeCategory = "기본";
      chrome.storage.sync.set({ activeCategory });
    }

    document.getElementById("currentCategory").textContent = activeCategory;

    renderNormalCategories(categories, savedUrls, activeCategory);
    renderTrashCategory(savedUrls["휴지통"] || []); 
    renderCategoryList(categories, activeCategory);
    if(dropdown){
      dropDownByActiveCategory();
    }
  });
}
