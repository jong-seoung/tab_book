import { getSavedUrls } from "../useState.js";
import {
  deleteUrlToButtonX,
  restoreUrlToButton,
  updateUrlItem,
} from "./urlsCRUD.js";
import { attachUrlDragAndDropHandlers } from "../common/dragDropToCategoryAndUrls.js";
import { showUrlEditModal } from "../common/confirm.js";
import { t } from "../i18n/i18n.js";

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
    none.textContent = isTrash ? t("trashEmpty") : t("noSavedUrls");
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

    const favicon = document.createElement("img");
    favicon.className = "url-favicon";
    try {
      const domain = new URL(item.url).hostname;
      favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      favicon.src = chrome.runtime.getURL("icons/default_favicon.png");
    }
    favicon.onerror = () => {
      favicon.src = chrome.runtime.getURL("icons/default_favicon.png");
    };

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

    if (isTrash) {
      link.addEventListener("click", () => chrome.tabs.create({ url: item.url }));

      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = t("restore");
      restoreBtn.className = "restoreBtn";
      restoreBtn.style.textAlign = "right";
      restoreBtn.addEventListener("click", () => restoreUrlToButton(item));

      const btnDiv = document.createElement("div");
      btnDiv.style.justifyContent = "center";
      btnDiv.append(restoreBtn, deleteBtn);
      div.style.justifyContent = "space-between";
      const linkWrapper = document.createElement("div");
      linkWrapper.style.cssText = "display:flex;align-items:center;gap:5px;flex:1;min-width:0;overflow:hidden;";
      linkWrapper.append(favicon, link);
      div.append(linkWrapper, btnDiv);
    } else {
      const editBtn = document.createElement("button");
      editBtn.className = "editBtn";
      editBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle;">edit</span>';
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showUrlEditModal(item, (newTitle, newUrl) => {
          updateUrlItem(category, item, newTitle, newUrl);
        });
      });

      link.addEventListener("click", () => chrome.tabs.create({ url: item.url }));

      const btnDiv = document.createElement("div");
      btnDiv.append(editBtn, deleteBtn);
      const linkWrapper = document.createElement("div");
      linkWrapper.style.cssText = "display:flex;align-items:center;gap:5px;flex:1;min-width:0;overflow:hidden;";
      linkWrapper.append(favicon, link);
      div.append(linkWrapper, btnDiv);
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

