import { showCustomAlert } from "../utils/customDialogs.js";
import { getUserVersion } from "./userStorage.js";
import { loadData } from "../utils/loadData.js";

/** 카테고리 삭제 **/
export function deleteCategory(category) {
  chrome.storage.sync.get(["categories", "savedUrls", "activeCategory"], (data) => {
    let categories = data.categories || [];
    let savedUrls = data.savedUrls || {};
    let activeCategory = data.activeCategory;

    categories = categories.filter(c => c !== category);
    delete savedUrls[category];

    if (activeCategory === category) {
      activeCategory = categories[0] || "없음";
    }

    chrome.storage.sync.set({ categories, savedUrls, activeCategory }, () => {
      loadData();
    });
  });
}

/** 카테고리 이름 변경 **/
export function updateCategory(oldName, newName) {
  chrome.storage.sync.get(["categories", "savedUrls", "activeCategory"], (data) => {
    let categories = data.categories || [];
    let savedUrls = data.savedUrls || {};
    let activeCategory = data.activeCategory;

    categories = categories.map(cat => cat === oldName ? newName : cat);
    savedUrls[newName] = savedUrls[oldName];
    delete savedUrls[oldName];
    activeCategory = newName;

    chrome.storage.sync.set({ categories, savedUrls, activeCategory }, () => {
      loadData();
    });
  });
}

/** 새로운 카테고리 추가 **/
export function addNewCategory(newCat, callback) {
  chrome.storage.sync.get("categories", (data) => {
    const categories = data.categories || [];

    getUserVersion((isPaidUser) => {
      if (!isPaidUser && categories.length > 3) {
        showCustomAlert("무료 버전에서는 최대 3개의 <br>카테고리만 추가할 수 있습니다.");
        newCategoryInput.style.display = "none"; 
        addCategoryBtn.style.display = "block";
        return;
      }

      if (!categories.includes(newCat)) {
        categories.push(newCat);
        chrome.storage.sync.set({ categories }, callback);
      }
    });
  });
}

/** 휴지통 카테고리에서 링크 삭제 **/
export function deleteTrashCategory(category, urlToDelete) {
    chrome.storage.sync.get("savedUrls", (data) => {
      const savedUrls = data.savedUrls || {};
      const categoryUrls = savedUrls[category] || [];
      const updatedUrls = categoryUrls.filter(url => url.url !== urlToDelete);
      savedUrls[category] = updatedUrls;
  
      chrome.storage.sync.set({ savedUrls }, () => {
        const urlItem = document.querySelector(`.url-item a[href="${urlToDelete}"]`)?.parentElement;
        if (urlItem) urlItem.remove();
      });
    });
  }