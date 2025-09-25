import { getSavedUrls } from "../useState.js";
import {
  deleteUrlToButtonX,
  restoreUrlToButton,
  updateUrlTitle,
} from "./urlsCRUD.js";
import { attachUrlDragAndDropHandlers } from "../common/dragDropToCategoryAndUrls.js";

export function renderUrls(category) {
  const urls = getSavedUrls()[category];

  // 휴지통 url 목록
  if (category == "휴지통") {
    return createUrlList(category, urls, true);
  }
  // 일반 url
  return createUrlList(category, urls, false);
}

function createUrlList(category, urls, isTrash = false) {
  const urlList = document.createElement("div");
  urlList.className = "url-list";

  if (!Array.isArray(urls) || urls.length === 0) {
    const none = document.createElement("div");
    none.textContent = isTrash ? "휴지통이 비었습니다." : "저장된 URL 없음";
    none.style.fontSize = "12px";
    urlList.appendChild(none);
    return urlList;
  }

  urls.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "url-item";
    div.draggable = true;
    div.dataset.isEditing = "false";
    div.dataset.url = item.url;
    div.dataset.index = index;

    const link = document.createElement(isTrash ? "a" : "p");
    if (isTrash) {
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.display = "inline-block";
      link.style.maxWidth = "70%";
      link.style.overflow = "hidden";
      link.style.textOverflow = "ellipsis";
      link.style.whiteSpace = "nowrap";
    }
    link.textContent = item.title || item.url;

    attachUrlDragAndDropHandlers(div, category);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.className = "deleteBtn";
    deleteBtn.style.marginRight = isTrash ? "7px" : "0";
    deleteBtn.addEventListener("click", () =>
      deleteUrlToButtonX(category, item)
    );

    ulrListEvent(div, link, deleteBtn, category, item);

    if (isTrash) {
      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "복구";
      restoreBtn.className = "restoreBtn";
      restoreBtn.style.textAlign = "right";
      restoreBtn.addEventListener("click", () => restoreUrlToButton(item));

      const btnDiv = document.createElement("div");
      btnDiv.style.justifyContent = "center";
      btnDiv.append(restoreBtn, deleteBtn);
      div.style.justifyContent = "space-between";
      div.append(link, btnDiv);
    } else {
      div.appendChild(link);
      div.appendChild(deleteBtn);
    }

    urlList.appendChild(div);
  });

  if (!isTrash) {
    const dummyWrapper = document.createElement("div");
    dummyWrapper.className = "url-item";
    dummyWrapper.dataset.index = urls.length;
    dummyWrapper.innerText = " ";
    dummyWrapper.style.height = "5px";
    dummyWrapper.draggable = false;

    const link = document.createElement("p");
    attachUrlDragAndDropHandlers(dummyWrapper, category);
    dummyWrapper.appendChild(link);
    urlList.appendChild(dummyWrapper);
  }
  return urlList;
}

function ulrListEvent(div, link, deleteBtn, category, item) {
  let clickTimer = null;

  link.addEventListener("click", () => {
    if (clickTimer) return;

    clickTimer = setTimeout(() => {
      chrome.tabs.create({ url: item.url });
      clickTimer = null;
    }, 300);
  });

  link.addEventListener("dblclick", () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
    enableInlineEdit(div, link, deleteBtn, category, item);
  });
}

// 더블 클릭시 input 생성
function enableInlineEdit(div, link, deleteBtn, categoryName, item) {
  const currentTitle = link.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentTitle;
  input.style.maxWidth = "70%";

  toggleEditState(div, link, deleteBtn, true);

  div.appendChild(input);
  input.focus();

  div.dataset.isEditing = "true";

  function handleClickOutside(e) {
    if (!div.contains(e.target)) {
      toggleEditState(div, link, deleteBtn, false);
      input.remove();
    }
  }

  document.addEventListener("click", handleClickOutside);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const newTitle = input.value.trim();
      if (newTitle !== "") {
        updateUrlTitle(categoryName, item, newTitle);
      }
      toggleEditState(div, link, deleteBtn, false);
      input.remove();
    } else if (e.key === "Escape") {
      toggleEditState(div, link, deleteBtn, false);
      input.remove();
    }
  });
}

function toggleEditState(div, link, deleteBtn, isEditing) {
  div.draggable = isEditing ? false : true;
  link.style.display = isEditing ? "none" : "inline-block";
  deleteBtn.style.display = isEditing ? "none" : "inline-block";
  div.dataset.isEditing = isEditing ? "true" : "false";
}
