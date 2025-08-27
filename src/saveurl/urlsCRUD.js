import { getSavedUrls, setSavedUrls } from "../useState.js";
import { openUrlListByCategory } from "../common/afterEvent.js";
// add urls
export function addUrlToActiveCategory(data, tabs, isNotification = true) {
  const activeCategory = data.activeCategory;

  const allSavedUrls = data.savedUrls;
  const categoryUrls = allSavedUrls[activeCategory] || [];

  tabs.forEach((element) => {
    categoryUrls.push({
      title: element.title,
      url: element.url,
    });
  });

  allSavedUrls[activeCategory] = categoryUrls;

  setSavedUrls(allSavedUrls);
  chrome.storage.sync.set({ savedUrls: allSavedUrls }, () => {
    openUrlListByCategory(activeCategory);
  });
}

// rename urls
export function updateUrlTitle(category, element, newTitle) {
  console.log(category);
  console.log(element);
  console.log(newTitle);

  const savedUrls = getSavedUrls();
  const categorySavedUrls = savedUrls[category];

  categorySavedUrls.find((item) => item === element).title = newTitle;

  const newSavedUrls = {
    ...savedUrls,
    [category]: categorySavedUrls,
  };
  setSavedUrls(newSavedUrls);
  chrome.storage.sync.set({ savedUrls: newSavedUrls });
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

    element["beforeCategory"] = category;
    const updatedTrash = [...trashUrls, element];

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

  const restoreSaveUrls = [...beforeUrls, element];

  const newSavedUrls = {
    ...savedUrls,
    [beforeCategory]: restoreSaveUrls,
    ["휴지통"]: trashUrls,
  };

  setSavedUrls(newSavedUrls);
  chrome.storage.sync.set({ savedUrls: newSavedUrls }, () => {
    openUrlListByCategory("휴지통");
  });
}