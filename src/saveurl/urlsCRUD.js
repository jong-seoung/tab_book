import {
  getActiveCategory,
  getSavedUrls,
  getUserActive,
  setSavedUrls,
} from "../useState.js";
import { openUrlListByCategory, showUrlListByCategory } from "../common/afterEvent.js";
import { notifyUrlLimitReached } from "../user/ProUserNoti.js";

// add urls
export function addUrlToActiveCategory(data, tabs, isBackground = false) {
  if (!getUserActive() && notifyUrlLimitReached(data, tabs)) {
    return;
  }

  let activeCategory;
  let SavedUrls;

  if (isBackground) {
    activeCategory = data.activeCategory;
    SavedUrls = data.savedUrls;
  } else {
    activeCategory = getActiveCategory();
    SavedUrls = getSavedUrls();
  }

  const categoryUrls = SavedUrls[activeCategory];

  tabs.forEach((tab) => {
    const exists = categoryUrls.some(
      (item) => item.url === tab.url && item.title === tab.title
    );
    if (!exists) {
      categoryUrls.push({
        title: tab.title,
        url: tab.url,
      });
    }
  });

  SavedUrls[activeCategory] = categoryUrls;

  setSavedUrls(SavedUrls);

  chrome.storage.sync.set({ savedUrls: SavedUrls }, () => {
    if (isBackground) {
      chrome.runtime.sendMessage({ type: "CATEGORY_UPDATED" }, () => {
        if (chrome.runtime.lastError) return;
      });
    } else {
      openUrlListByCategory(activeCategory);
    }
  });
}

// rename urls
export function updateUrlTitle(category, element, newTitle) {
  const savedUrls = getSavedUrls();
  const categorySavedUrls = savedUrls[category];

  categorySavedUrls.find((item) => item === element).title = newTitle;

  const newSavedUrls = {
    ...savedUrls,
    [category]: categorySavedUrls,
  };
  setSavedUrls(newSavedUrls);
  chrome.storage.sync.set({ savedUrls: newSavedUrls }, () => {
    openUrlListByCategory(category);
  });
}

// delete urls
export function deleteUrlToButtonX(category, element) {
  const savedUrls = getSavedUrls();
  const trashUrls = savedUrls["휴지통"] || [];
  let newSavedUrls;

  if (category == "휴지통") {
    // 휴지통이면 영구 삭제
    const updatedTrash = trashUrls.filter((url) => url !== element);

    newSavedUrls = {
      ...savedUrls,
      ["휴지통"]: updatedTrash,
    };
  } else {
    // 휴지통이 아니면 휴지통으로 이동
    const deleteUrls = savedUrls[category].filter((url) => url !== element);

    const trashItem = { ...element, beforeCategory: category };
    
    const exists = trashUrls.some(
      (item) =>
        item.url === trashItem.url &&
        item.title === trashItem.title &&
        item.beforeCategory === trashItem.beforeCategory
    );

    const updatedTrash = exists ? trashUrls : [...trashUrls, trashItem];

    newSavedUrls = {
      ...savedUrls,
      ["휴지통"]: updatedTrash,
      [category]: deleteUrls,
    };
  }

  setSavedUrls(newSavedUrls);
  chrome.storage.sync.set({ savedUrls: newSavedUrls }, () => {
    openUrlListByCategory(category);
  });
}

// restore urls
export function restoreUrlToButton(element) {
  const savedUrls = getSavedUrls();
  // 휴지통에서 삭제
  const trashUrls = savedUrls["휴지통"].filter((url) => url !== element);

  // 이동
  const beforeCategory = element.beforeCategory;

  const beforeUrls = savedUrls[beforeCategory] || [];
  delete element.beforeCategory;

  const exists = beforeUrls.some(
    (item) => item.url === element.url && item.title === element.title
  );

  const restoreSaveUrls = exists ? beforeUrls : [...beforeUrls, element];

  const newSavedUrls = {
    ...savedUrls,
    [beforeCategory]: restoreSaveUrls,
    ["휴지통"]: trashUrls,
  };

  setSavedUrls(newSavedUrls);
  chrome.storage.sync.set({ savedUrls: newSavedUrls }, () => {
    showUrlListByCategory("휴지통");
    showUrlListByCategory(beforeCategory);
  });
}
