import {
  getCategories,
  getSavedUrls,
  setCategories,
  setSavedUrls,
} from "../useState.js";
import { openUrlListByCategory } from "./afterEvent.js";

let currentDragType = null; // "category" 또는 "url" 또는 null

function setDragType(type) {
  currentDragType = type;
}

function clearDragType() {
  currentDragType = null;
}

// 수정해야함
function moveUrl(data, toCategory) {
  const savedUrls = getSavedUrls();

  let savedUrls_from = savedUrls[data.fromCategory];
  let savedUrls_to = savedUrls[toCategory];

  const [moved] = savedUrls_from.splice(data.fromIndex, 1);
  savedUrls_to.push(moved);

  const NewSavedUrls = {
    ...savedUrls,
    [data.fromCategory]: savedUrls_from,
    [toCategory]: savedUrls_to,
  };

  setSavedUrls(NewSavedUrls);
  chrome.storage.sync.set({ savedUrls: NewSavedUrls }, () => {
    openUrlListByCategory(data.fromCategory);
    openUrlListByCategory(toCategory);
  });
}

/**
 * 공통 Drag&Drop 이벤트 바인더
 * @param {HTMLElement} element - 드래그 대상 요소
 * @param {Object} options
 * @param {"url"|"category"} options.type - 드래그 타입
 * @param {Function} options.onDrop - drop 시 실행되는 콜백
 * @param {Function} [options.onOverStyle] - dragover 스타일 변경 함수
 * @param {Function} [options.onLeaveStyle] - dragleave 스타일 초기화 함수
 * @param {Function} [options.setDragData] - dragstart 시 전송할 데이터 설정
 */
function createDragAndDropHandlers(
  element,
  { type, onDrop, onOverStyle, onLeaveStyle, setDragData }
) {
  element.addEventListener("dragstart", (e) => {
    setDragType(type);
    if (setDragData) {
      e.dataTransfer.setData("text/plain", JSON.stringify(setDragData(e)));
    }
  });

  element.addEventListener("dragend", () => {
    clearDragType();
  });

  element.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (onOverStyle) onOverStyle(e);
  });

  element.addEventListener("dragleave", (e) => {
    if (onLeaveStyle) onLeaveStyle(e);
  });

  element.addEventListener("drop", (e) => {
    e.preventDefault();

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    onDrop(e, data);
  });
}

/* ------------------- 카테고리 드래그 앤 드롭 ------------------- */
export function attachCategoryDragAndDrop(header) {
  createDragAndDropHandlers(header, {
    type: "category",
    onOverStyle: () => {
      if (currentDragType !== "category") {
        header.style.color = "red";
      } else {
        header.style.borderTop = "2px dashed orange";
      }
    },
    onLeaveStyle: () => {
      header.style.color = "";
      header.style.borderTop = "";
    },
    setDragData: () => ({
      type: "category",
      fromCategory: header.dataset.category,
    }),
    onDrop: (_, data) => {
      header.style.color = "";
      header.style.borderTop = "";

      const targetCategory = header.dataset.category;
      if (currentDragType !== "category") {
        moveUrl(data, targetCategory);
      } else {
        if (data.type === "category") {
          moveCategory(data.fromCategory, targetCategory);
        }
      }
    },
  });
}

// from을 to 위로 보내기
function moveCategory(fromCategory, toCategory) {
  const categories = getCategories();
  const fromIndex = categories.indexOf(fromCategory);

  if (toCategory === undefined) {
    const [moved] = categories.splice(fromIndex, 1);
    categories.push(moved);
  } else {
    let toIndex = categories.indexOf(toCategory);
    if (fromIndex < toIndex) toIndex--;
    categories.splice(toIndex, 0, ...categories.splice(fromIndex, 1));
  }

  setCategories(categories);
  chrome.storage.sync.set({ categories }, () => {});
}

/* ------------------- URL 드래그 앤 드롭 ------------------- */
export function attachUrlDragAndDropHandlers(urlItemDiv, categoryName) {
  createDragAndDropHandlers(urlItemDiv, {
    type: "url",
    setDragData: () => ({
      type: "url",
      fromCategory: categoryName,
      fromIndex: Number(urlItemDiv.dataset.index),
    }),
    onOverStyle: (e) => {
      if (currentDragType !== "url") return;
      const target = e.target.closest(".url-item");
      if (!target || target.parentNode !== urlItemDiv.parentNode) return;
      target.style.borderTop = "1px solid orange";
    },
    onLeaveStyle: (e) => {
      if (currentDragType !== "url") return;
      const target = e.target.closest(".url-item");
      if (!target || target.parentNode !== urlItemDiv.parentNode) return;
      target.style.borderTop = "";
    },
    onDrop: (e, data) => {
      if (data.fromCategory !== categoryName) return;

      const target = e.target.closest(".url-item");
      if (!target) return;

      target.style.borderTop = "";

      const fromIndex = data.fromIndex;
      const toIndex = Number(target.dataset.index);

      if (fromIndex !== toIndex) {
        moveUrlInsideCategory(categoryName, fromIndex, toIndex);
      }
    },
  });
}

function moveUrlInsideCategory(categoryName, fromIndex, toIndex) {
  const savedUrls = getSavedUrls();
  let savedUrls_toMove = savedUrls[categoryName];

  if (toIndex === savedUrls_toMove.length) {
    const [moved] = savedUrls_toMove.splice(fromIndex, 1);
    savedUrls_toMove.push(moved);
  } else {
    if (fromIndex < toIndex) toIndex--;
    savedUrls_toMove.splice(
      toIndex,
      0,
      ...savedUrls_toMove.splice(fromIndex, 1)
    );
  }

  const NewSavedUrls = {
    ...savedUrls,
    [categoryName]: savedUrls_toMove,
  };

  setSavedUrls(NewSavedUrls);
  
  chrome.storage.sync.set({ savedUrls: NewSavedUrls }, () => {
    openUrlListByCategory(categoryName);
  });
}
