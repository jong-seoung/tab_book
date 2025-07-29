import { renderNormalCategories } from "../ui/normalCategoryRender.js";
import { moveUrl } from "../storage/urlStorage.js";
import { setDragType, clearDragType, currentDragType } from "./dragState.js";

export function attachCategoryDragAndDrop(header, categoryName) {
    header.addEventListener("dragover", (e) => {
        e.preventDefault();

        if (currentDragType !== "category") {
            header.style.color = "red";
        }else{
            header.style.borderTop = "2px dashed orange";
        };
    });

    header.addEventListener("dragleave", () => {
        if (currentDragType !== "category") {
            header.style.color = "";
        }else{
            header.style.borderTop = "";
        };
    });

    header.addEventListener("drop", (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        if (currentDragType !== "category") {
            header.style.color = "";
            moveUrl(data.url, data.title, data.fromCategory, categoryName);
        }else{
            header.style.borderTop = "";
            const targetCategory = header.dataset.categoryName;
            if (data.type === "category") {
                moveCategory(data.fromCategory, targetCategory);
            }
        };
    });

    header.addEventListener("dragstart", (e) => {
        setDragType("category");
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: "category",
            fromCategory: categoryName
        }));
    });

    header.addEventListener("dragend", () => {
        clearDragType();
    });
}

function moveCategory(fromCategory, toCategory) {
  chrome.storage.sync.get(["categories", "savedUrls"], (data) => {
    const categories = data.categories || [];
    const savedUrls = data.savedUrls || {};

    const fromIdx = categories.indexOf(fromCategory);
    let toIdx = categories.indexOf(toCategory);

    if (fromIdx === -1 || fromIdx === toIdx) return;

    const [moveCategory] = categories.splice(fromIdx, 1);
    if (fromIdx < toIdx) toIdx--;

    categories.splice(toIdx, 0, moveCategory);

    chrome.storage.sync.set({ categories }, () => {
      renderNormalCategories(categories, savedUrls);
    });
  });
}
