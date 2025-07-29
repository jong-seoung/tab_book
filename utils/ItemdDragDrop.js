import { setDragType, clearDragType, currentDragType } from "./dragState.js";

export function attachUrlDragAndDropHandlers(urlList, categoryName) {
  urlList.addEventListener("dragstart", (e) => {
    setDragType("url");
  });

  urlList.addEventListener("dragend", (e) => {
    clearDragType();
  });

  urlList.addEventListener("dragover", (e) => {
    if (currentDragType !== "url") return; 
    e.preventDefault();
    const target = e.target.closest(".url-item");
    if (!target || target.parentNode !== urlList) return;
    target.style.borderTop = "1px solid orange";
  });

  urlList.addEventListener("dragleave", (e) => {
    if (currentDragType !== "url") return;
    const target = e.target.closest(".url-item");
    if (!target || target.parentNode !== urlList) return;
    target.style.borderTop = "";
  });

  urlList.addEventListener("drop", (e) => {
    e.preventDefault();
    if (currentDragType !== "url") return;
    const target = e.target.closest(".url-item");

    if (!target || target.parentNode !== urlList) return;
    target.style.borderTop = "";

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.fromCategory !== categoryName) return;
    
    const fromIndex = data.fromIndex;
    let toIndex = Number(target.dataset.index);
    if (fromIndex !== toIndex) {
      moveUrlInsideCategory(categoryName, fromIndex, toIndex, urlList);
    }
  });
}

function moveUrlInsideCategory(categoryName, fromIndex, toIndex, urlList) {
  chrome.storage.sync.get(["savedUrls"], (data) => {
    const saved = data.savedUrls || {};
    const urls = saved[categoryName] || [];

    const [movedItem] = urls.splice(fromIndex, 1);

    let insertIdx = toIndex;
    if (fromIndex < toIndex) insertIdx--;

    urls.splice(insertIdx, 0, movedItem);
    saved[categoryName] = urls;

    chrome.storage.sync.set({ savedUrls: saved }, () => {
      renderUrlList(categoryName, urls, urlList);
    });
  });
}

export function renderUrlList(categoryName, urls, urlList) {
  urlList.innerHTML = "";

  if (urls.length === 0) {
    const none = document.createElement("div");
    none.textContent = "저장된 URL 없음";
    none.style.fontSize = "12px";
    urlList.appendChild(none);
  } else {
    urls.forEach((item, index) => {
      const div = document.createElement("div");
      div.draggable = true;
      div.className = "url-item";
      div.dataset.isEditing = "false";
      div.dataset.url = item.url;
      div.dataset.index = index;

      const link = document.createElement("p");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = item.title || item.url;

      link.style.display = "inline-block";
      link.style.maxWidth = "70%";
      link.style.overflow = "hidden";
      link.style.textOverflow = "ellipsis";
      link.style.whiteSpace = "nowrap";
      link.style.margin = "0px";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "x";
      deleteBtn.className = "deleteBtn";
      deleteBtn.style.marginRight = "7px";

      deleteBtn.addEventListener("click", () => {
        deleteUrl(categoryName, item.url);
      });

      let clickTimeout;

      link.addEventListener("click", (e) => {
        if (e.detail > 1 || div.dataset.isEditing === "true") {
          return;
        }
        e.preventDefault();
        clickTimeout = setTimeout(() => {
          window.open(item.url, '_blank');
        }, 300);
      });

      link.addEventListener("dblclick", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(clickTimeout);
        enableInlineEdit(div, link, deleteBtn, categoryName, item);
      });

      div.addEventListener("dragstart", (e) => {
        setDragType("url");
        e.dataTransfer.setData("text/plain", JSON.stringify({
          url: item.url,
          title: item.title,
          fromCategory: categoryName,
          fromIndex: index,
        }));
      });

      div.addEventListener("dragend", (e) => {
        clearDragType();
      });

      div.appendChild(link);
      div.appendChild(deleteBtn);
      urlList.appendChild(div);
    });

    const dummyDiv = document.createElement("div");
    dummyDiv.className = "url-item";
    dummyDiv.dataset.index = urls.length;
    dummyDiv.style.height = "1px";
    urlList.appendChild(dummyDiv);
  }

  attachUrlDragAndDropHandlers(urlList, categoryName);
}