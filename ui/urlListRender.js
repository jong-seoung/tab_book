import { attachUrlDragAndDropHandlers } from "../utils/ItemdDragDrop.js";
import { deleteUrl } from "../storage/urlStorage.js";
import { updateUrlTitle } from "../storage/urlStorage.js";

export function createNormalUrlList(categoryName, urls) {
  const urlList = document.createElement("div");
  urlList.className = "url-list";

  if (urls.length === 0) {
    const none = document.createElement("div");
    none.textContent = "저장된 URL 없음";
    none.style.fontSize = "12px";
    urlList.appendChild(none);
  } else {
    urls.forEach((item, index) => {
      if (!item || !item.url) {
        chrome.storage.sync.get("savedUrls", (data) => {
          const savedUrls = data.savedUrls || {};
          const categoryUrls = savedUrls[categoryName] || [];
          const updatedUrls = categoryUrls.filter(urlItem => urlItem && urlItem.url);

          savedUrls[categoryName] = updatedUrls;

          chrome.storage.sync.set({ savedUrls }, () => {
            console.warn(`Removed invalid items in category "${categoryName}"`);
          });
        });

        return;
      }
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

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "x";
      deleteBtn.className = "deleteBtn";

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
        e.dataTransfer.setData("text/plain", JSON.stringify({
          url: item.url,
          title: item.title,
          fromCategory: categoryName,
          fromIndex: index,
        }));
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
  return urlList;
}

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
        link.textContent = newTitle;
        updateUrlTitle(categoryName, item.url, newTitle);
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
  link.style.display = isEditing ? "none" : "inline-block";
  deleteBtn.style.display = isEditing ? "none" : "inline-block";
  div.dataset.isEditing = isEditing ? "true" : "false";
}