import { createTrashCategory } from "./src/category/renderTrash.js";
import { loadUserData } from "./src/user/loadUserData.js";
import { setUpAddUrlButton } from "./src/activeCategory/saveButton.js";
import { renderTooltip } from "./src/user/toolTip.js";

import {
  renderActiveCategory,
  initCategoryDropdownEvent,
} from "./src/activeCategory/renderActiveCategory.js";

import {
  renderCategories,
  createAddCategoryButton,
} from "./src/category/renderCategory.js";

import {
  setCategories,
  setSavedUrls,
  setActiveCategory,
  subscribeCategory,
  subscribeSavedUrls,
  subscribeActiveCategory,
} from "./src/useState.js";

export async function loadData() {
  loadUserData();
  loadChromeStorage();

  subscribeCategory(renderCategories);
  subscribeCategory(createTrashCategory);

  subscribeSavedUrls(renderCategories);
  subscribeSavedUrls(createTrashCategory);

  subscribeActiveCategory(renderActiveCategory);

  // 기능
  initCategoryDropdownEvent();
  createAddCategoryButton();
  setUpAddUrlButton();
  renderTooltip();
}

export async function loadChromeStorage() {
  // chrome.storage.sync.remove(["categories", 'savedUrls', 'activeCategory'], () => {
  // console.log("✅ savedUrls 와 activeCategory가 삭제되었습니다.");
  // });
  chrome.storage.sync.get(
    ["categories", "savedUrls", "activeCategory"],
    (data) => {
      initializeDefaultStorageIfEmpty(data);
      console.log(data);
    }
  );
}

function initializeDefaultStorageIfEmpty(data) {
  // 1. categories
  const categories = data.categories || [];

  if (categories.length === 0) {
    const defaultCategories = ["기본"];
    setCategories(defaultCategories);
    chrome.storage.sync.set({ categories: defaultCategories });
  } else {
    setCategories(data.categories);
  }

  // 2. savedUrls
  if (!data.savedUrls || Object.keys(data.savedUrls).length === 0) {
    const defaultSavedUrls = { 기본: [] };
    setSavedUrls(defaultSavedUrls);
    chrome.storage.sync.set({ savedUrls: defaultSavedUrls });
  } else {
    setSavedUrls(data.savedUrls);
  }

  // 3. activeCategory
  if (data.activeCategory === "" || data.activeCategory === null) {
    const defaultActiveCategory = "기본";
    setActiveCategory(defaultActiveCategory);
    chrome.storage.sync.set({ activeCategory: defaultActiveCategory });
  } else {
    setActiveCategory(data.activeCategory);
  }
}
