import { styleButton } from "../common/common.js";
import { deleteCategory, updateCategory } from "./categoryCRUD.js"
import { showCustomConfirm, showCustomPrompt, showCustomAlertOnly } from "../common/confirm.js";
import { t } from "../i18n/i18n.js";
import { getCategories } from "../useState.js";

let openedSettingMenu = null;

// setting button 생성
export function createSettingButton(category) {
  const settingBtn = document.createElement("button");
  settingBtn.className = "setting-button";
  styleButton(settingBtn, "gray");
  settingBtn.style.height = "100%";

  const img = document.createElement("img");
  img.className = "setting-icon";
  img.src = "src/public/p.png";
  img.alt = "설정";

  settingBtn.appendChild(img);

  const menu = createSettingMenu(category);
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

// setting button 클릭시 활성화 되는 버튼 메뉴
export function createSettingMenu(category) {
  const menu = document.createElement("div");
  menu.className = "setting-menu";

  const renameItem = document.createElement("div");
  renameItem.className = "setting-item";
  renameItem.textContent = t("rename");
  renameItem.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.style.display = "none";

    showCustomPrompt(
      t("renamePrompt", { category }),
      "",
      (newCatName) => {
        if (
          newCatName &&
          newCatName.trim() !== "" &&
          newCatName.trim() !== category
        ) {
          updateCategory(category, newCatName.trim());
        }
      },
      () => {
      }
    );
  });

  const deleteItem = document.createElement("div");
  deleteItem.className = "setting-item";
  deleteItem.textContent = t("delete");
  deleteItem.style.color = "red";
  deleteItem.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.style.display = "none";

    const categories = getCategories().filter((c) => c !== "휴지통");
    if (categories.length <= 1) {
      showCustomAlertOnly(t("cannotDeleteLastCategory"));
      return;
    }

    showCustomPrompt(
      t("deleteCategoryPrompt", { category }),
      "",
      function handleInput(userInput) {
        if (userInput === category) {
          deleteCategory(category);
        } else {
          showCustomConfirm(t("deleteWrongInput"), function () {
            deleteItem.click();
          });
        }
      },
      function onCancel() {
      }
    );
  });

  menu.append(renameItem, deleteItem);
  return menu;
}
