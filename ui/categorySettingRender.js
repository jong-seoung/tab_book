import { deleteCategory, updateCategory } from "../storage/categoryStorage.js";
import { showCustomConfirm, showCustomPrompt } from "../utils/customDialogs.js";
import { styleButton } from "./common.js";

let openedSettingMenu = null;

export function createSettingButton(categoryName) {
  const settingBtn = document.createElement("button");
  settingBtn.className = "setting-button";
  styleButton(settingBtn, "gray");
  settingBtn.style.height = "100%";

  const img = document.createElement("img");
  img.className = "setting-icon";
  img.src = "p.png";
  img.alt = "설정";

  settingBtn.appendChild(img);

  const menu = createSettingMenu(categoryName);
  document.body.appendChild(menu);

  settingBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (openedSettingMenu && openedSettingMenu !== menu) {
      openedSettingMenu.style.display = "none";
    }
    const rect = settingBtn.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.display = menu.style.display === "none" ? "block" : "none";

    openedSettingMenu = menu.style.display === "block" ? menu : null;
  });

  document.addEventListener("click", () => {
    menu.style.display = "none";
  });

  return settingBtn;
}


function createSettingMenu(categoryName) {
  const menu = document.createElement("div");
  menu.className = "setting-menu";

  const renameItem = document.createElement("div");
  renameItem.className = "setting-item";
  renameItem.textContent = "이름 변경";
  renameItem.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.style.display = "none";

    showCustomPrompt(
      `"${categoryName}"의 이름을 변경합니다.`,
      "",
      (newCatName) => { 
        if (newCatName && newCatName.trim() !== "" && newCatName.trim() !== categoryName) {
          updateCategory(categoryName, newCatName.trim());
        }
      },
      () => {
        console.log("변경 취소됨");
      }
    );
  });

  const deleteItem = document.createElement("div");
  deleteItem.className = "setting-item";
  deleteItem.textContent = "삭제";
  deleteItem.style.color = "red";
  deleteItem.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.style.display = "none";

    showCustomPrompt(
      `"${categoryName}" 카테고리를 삭제하려면 이름을 정확히 입력하세요.`,
      "",
      function handleInput(userInput) {
        if (userInput === categoryName) {
          deleteCategory(categoryName);
        } else {
          showCustomConfirm("틀립니다. 다시 입력해주세요.", function () {
            deleteItem.click(); 
          });
        }
      },
      function onCancel() {
        console.log("삭제 취소됨");
      }
    );
});

  menu.append(renameItem, deleteItem);
  return menu;
}