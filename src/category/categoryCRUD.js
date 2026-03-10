import {
  setCategories,
  getCategories,
  getSavedUrls,
  setSavedUrls,
  setActiveCategory,
  getActiveCategory,
} from "../useState.js";

// category active
export function changeActiveCategory(category) {
  setActiveCategory(category);

  chrome.storage.sync.set({ activeCategory: category }, () => {});
}

// category create
export function addCategory(newCategory) {
  if (newCategory == "") {
    return;
  }

  // category add
  const newCategories = [...getCategories(), newCategory];
  setCategories(newCategories);

  // urls add
  const savedUrls = { ...getSavedUrls() };
  savedUrls[newCategory] = [];
  setSavedUrls(savedUrls);

  chrome.storage.sync.set(
    { categories: newCategories, savedUrls: savedUrls },
    () => {}
  );
}

// category update
export function updateCategory(oldCategory, newCategory) {
  const oldCategories = getCategories() ?? [];

  const updatedCategories = oldCategories.map((cat) => {
    return cat === oldCategory ? newCategory : cat;
  });

  const savedUrls = { ...getSavedUrls() };
  if (savedUrls[oldCategory]) {
    savedUrls[newCategory] = savedUrls[oldCategory];
    delete savedUrls[oldCategory];
    setSavedUrls(savedUrls);
  }

  const activeCategory = getActiveCategory();
  if (activeCategory === oldCategory) {
    setActiveCategory(newCategory);
  }

  setCategories(updatedCategories);

  chrome.storage.sync.set(
    {
      categories: updatedCategories,
      savedUrls: savedUrls,
      activeCategory: getActiveCategory(),
    },
    () => {}
  );
}

// category delete
export function deleteCategory(category) {
  const newCategories = getCategories().filter((cat) => cat !== category);

  setCategories(newCategories);

  const savedUrls = { ...getSavedUrls() };
  delete savedUrls[category];
  setSavedUrls(savedUrls);

  const activeCategory = getActiveCategory();
  if (activeCategory === category) {
    const fallback = newCategories[0] || "기본";
    setActiveCategory(fallback);
  }

  chrome.storage.sync.set(
    {
      categories: newCategories,
      savedUrls: savedUrls,
      activeCategory: getActiveCategory(),
    },
    () => {}
  );
}
