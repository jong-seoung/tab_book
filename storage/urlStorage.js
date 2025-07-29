import { renderTrashCategory } from "../ui/trashCategoryRender.js"; 
import { renderNormalCategories, renderMoveSingleCategory } from "../ui/normalCategoryRender.js"; 

/** 링크 삭제 **/
export function deleteUrl(category, urlToDelete) {
    chrome.storage.sync.get("savedUrls", (data) => {
      const savedUrls = data.savedUrls || {};
  
      const categoryUrls = savedUrls[category] || [];
      const urlObj = categoryUrls.find(url => url.url === urlToDelete);
      const updatedUrls = categoryUrls.filter(url => url.url !== urlToDelete);
      savedUrls[category] = updatedUrls;
  
      if (urlObj) {
        savedUrls["휴지통"] = savedUrls["휴지통"] || [];
        if (!savedUrls["휴지통"].some(url => url.url === urlToDelete)) {
        savedUrls["휴지통"].push({ ...urlObj, originalCategory: category });
        }
      }
    
      chrome.storage.sync.set({ savedUrls }, () => {
        const urlItem = document.querySelector(`.url-item[data-url="${urlToDelete}"]`);
        if (urlItem) {
          urlItem.remove();
          if (savedUrls[category].length === 0) {
            window.location.reload();
          }
          renderTrashCategory(savedUrls["휴지통"] || [])
      };
      });
    });
  }

/** 링크 모두 삭제 **/
export function deleteAllUrls(category) {
  chrome.storage.sync.get("savedUrls", (data) => {
    const savedUrls = data.savedUrls || {};

    const categoryUrls = savedUrls[category] || [];

    categoryUrls.forEach(urlObj => {
      savedUrls["휴지통"] = savedUrls["휴지통"] || [];
      if (!savedUrls["휴지통"].some(url => url.url === urlObj.url)) {
        savedUrls["휴지통"].push({ ...urlObj, originalCategory: category });
      }
      const urlItem = document.querySelector(`.url-item[data-url="${urlObj.url}"]`);
      if (urlItem) {
        urlItem.remove();
      }      
    });
    savedUrls[category] = [];

    chrome.storage.sync.set({ savedUrls }, () => {
      window.location.reload();
      });
  });
}

  
/** 휴지통에서 링크 삭제 (영구 삭제) **/
export function permanentlyDeleteUrl(urlToDelete) {
    chrome.storage.sync.get("savedUrls", (data) => {
      const savedUrls = data.savedUrls || {};
      const categoryUrls = savedUrls["휴지통"] || [];
      const updatedUrls = categoryUrls.filter(url => url.url !== urlToDelete);
      savedUrls["휴지통"] = updatedUrls;
  
      chrome.storage.sync.set({ savedUrls }, () => {
        const urlItem = document.querySelector(`.url-item a[href="${urlToDelete}"]`)?.parentElement;
        if (urlItem) urlItem.remove();
      });
    });
  }

// ** 휴지통에서 링크 복원 **//
export function restoreUrl(urlToRestore) {
    chrome.storage.sync.get(["categories", "savedUrls", "activeCategory"], (data) => {
      const savedUrls = data.savedUrls || {};
      const trashUrls = savedUrls["휴지통"] || [];
  
      const urlObj = trashUrls.find(url => url.url === urlToRestore);
      if (!urlObj) return;
  
      const originalCategory = urlObj.originalCategory || "기본";
      savedUrls[originalCategory] = savedUrls[originalCategory] || [];
      savedUrls[originalCategory].push({
        url: urlObj.url,
        title: urlObj.title
      });
  
      const updatedTrash = trashUrls.filter(url => url.url !== urlToRestore);
      savedUrls["휴지통"] = updatedTrash;
  
      chrome.storage.sync.set({ savedUrls }, () => {
        const urlItem = document.querySelector(`.url-item a[href="${urlToRestore}"]`)?.parentElement;
        if (urlItem) urlItem.remove();
        renderNormalCategories(data.categories, savedUrls, data.activeCategory);
      });
    });
  }
  
// ** 링크 카테고리 이동 **//
export function moveUrl(url, title, fromCategory, toCategory) {
  if (fromCategory === toCategory) return;

  chrome.storage.sync.get(["categories", "savedUrls", "activeCategory"], (data) => {
    const savedUrls = data.savedUrls || {};

    const urlObj = (savedUrls[fromCategory] || []).find(item => item.url === url);
    const title = urlObj ? urlObj.title : '';

    savedUrls[fromCategory] = (savedUrls[fromCategory] || []).filter(item => item.url !== url);
    savedUrls[toCategory] = savedUrls[toCategory] || [];
    savedUrls[toCategory].push({ url, title });

    chrome.storage.sync.set({ savedUrls }, () => {
      const urlItem = document.querySelector(`.url-item[data-url="${url}"]`);
      if (urlItem) urlItem.remove();
      if (savedUrls[fromCategory].length === 0) {
        window.location.reload();
      }
      renderMoveSingleCategory(toCategory, savedUrls[toCategory]);
    });
  });
}

// ** 링크 이름 변경 **//
export function updateUrlTitle(categoryName, oldUrl, newTitle) {
  chrome.storage.sync.get(["savedUrls"], (data) => {
    const savedUrls = data.savedUrls || {};
    if (savedUrls[categoryName]) {
      const urlIndex = savedUrls[categoryName].findIndex(urlItem => urlItem.url === oldUrl);
      if (urlIndex !== -1) {
        savedUrls[categoryName][urlIndex].title = newTitle;

        chrome.storage.sync.set({ savedUrls }, () => {
          return;
        });
      }
    }
  });
}

// ** 휴지통 비우기 **//
export function emptyTrash() {
  chrome.storage.sync.get("savedUrls", (data) => {
    const savedUrls = data.savedUrls || {};
    savedUrls["휴지통"] = [];
    chrome.storage.sync.set({ savedUrls }, () => {
      window.location.reload();
    });
  });
}

export function getUrlsByCategory(categoryName, callback) {
  chrome.storage.sync.get("savedUrls", (data) => {
    const savedUrls = data.savedUrls || {};
    callback(savedUrls[categoryName] || []);
  });
}