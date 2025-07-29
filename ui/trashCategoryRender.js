import { styleButton } from "./common.js";
import { emptyTrash, permanentlyDeleteUrl, restoreUrl } from "../storage/urlStorage.js";
import { showCustomConfirm } from "../utils/customDialogs.js";


export function renderTrashCategory(trashUrls) {
  const trashCategoryContainer = document.getElementById("trashCategoryContainer");
  trashCategoryContainer.innerHTML = "";

  const trashWrapper = createTrashCategoryWrapper(trashUrls);
  trashCategoryContainer.appendChild(trashWrapper);
}

export function createTrashCategoryWrapper(urls) {
  const wrapper = document.createElement("div");
  wrapper.className = "trashCategory-wrapper";
  wrapper.style.marginLeft = "10px";
  wrapper.style.marginBottom = "3px";

  const header = createTrashCategoryHeader();
  const urlList = createTrashUrlList(urls);

  header.addEventListener("click", () => {
    urlList.style.display = urlList.style.display === "block" ? "none" : "block";
  });

  wrapper.append(header, urlList);
  return wrapper;
}

function createTrashCategoryHeader() {
  const header = document.createElement("div");
  header.className = "category-header trash-header";

  const title = document.createElement("span");
  title.textContent = "휴지통";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "category-buttons";

  const trashBtn = trashDeleteAllButton();
  buttonsDiv.append(trashBtn);

  header.append(title, buttonsDiv);
  return header;
}

function trashDeleteAllButton() {
  const btn = document.createElement("button");
  btn.textContent = "비우기";
  styleButton(btn, "gray");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showCustomConfirm("휴지통을 비웁니다.<br>복원이 불가능합니다.", (confirmation) => {
      if (confirmation) {
        emptyTrash();  // 확인 클릭 시 휴지통 비우기
      }
    });
  });

  return btn;
}

export function createTrashUrlList(urls) {
  const urlList = document.createElement("div");
  urlList.className = "url-list";

  if (urls.length === 0) {
    const none = document.createElement("div");
    none.textContent = "휴지통이 비었습니다.";
    none.style.fontSize = "12px";
    urlList.appendChild(none);
  } else {
    urls.forEach(item => {
      const div = document.createElement("div");
      div.className = "url-item";
      div.style.justifyContent = "space-between";

      const displayText = item.title || item.url;

      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = displayText;

      link.style.display = "inline-block";
      link.style.maxWidth = "70%"; 
      link.style.overflow = "hidden";
      link.style.textOverflow = "ellipsis";
      link.style.whiteSpace = "nowrap";

      const btnDiv = document.createElement("btn");
      btnDiv.style.justifyContent = "center";
      
      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "복구";
      restoreBtn.className = "restoreBtn";
      restoreBtn.style.textAlign = "right";
      restoreBtn.addEventListener("click", () => restoreUrl(item.url));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "x";
      deleteBtn.className = "deleteBtn";
      deleteBtn.style.marginRight = "7px";
      deleteBtn.addEventListener("click", () => permanentlyDeleteUrl(item.url));

      btnDiv.append(restoreBtn, deleteBtn);
      div.append(link, btnDiv);
      urlList.appendChild(div);
    });
  }

  return urlList;
}
