import { addNewCategory } from '../storage/categoryStorage.js';
import { loadData } from '../utils/loadData.js';

//** "+" 버튼을 이용하여 새로운 카테고리를 추가하는 기능 **//
export function setupAddCategory() {
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const newCategoryInput = document.getElementById("newCategoryInput");
    const newCategoryInputField = document.getElementById("newCategory");

    const confirmAddCategoryBtn = document.createElement("button");
    confirmAddCategoryBtn.textContent = "추가";
    confirmAddCategoryBtn.id = "confirmAddCategoryBtn";
    confirmAddCategoryBtn.style.display = "none"; 
    newCategoryInput.appendChild(confirmAddCategoryBtn);

    addCategoryBtn.addEventListener("click", () => {
        newCategoryInput.style.display = "block";
        newCategoryInputField.focus();
        addCategoryBtn.style.display = "none";
        confirmAddCategoryBtn.style.display = "inline-block"; 
    });

    newCategoryInputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && newCategoryInputField.value.trim() !== "") {
            addCategory(newCategoryInputField, newCategoryInput, addCategoryBtn, confirmAddCategoryBtn);
        }
    });

    confirmAddCategoryBtn.addEventListener("click", () => {
        if (newCategoryInputField.value.trim() !== "") {
            addCategory(newCategoryInputField, newCategoryInput, addCategoryBtn, confirmAddCategoryBtn);
        }
    });

    document.addEventListener("click", (event) => {
      const isClickInside = newCategoryInput.contains(event.target) || addCategoryBtn.contains(event.target);
      if (!isClickInside) {
          newCategoryInput.style.display = "none";
          addCategoryBtn.style.display = "block";
          confirmAddCategoryBtn.style.display = "none";
          newCategoryInputField.value = "";
      }
  });
}

function addCategory(inputField, inputContainer, addButton, confirmButton) {
    addNewCategory(inputField.value.trim(), () => {
        inputContainer.style.display = "none";
        addButton.style.display = "block";
        confirmButton.style.display = "none"; 
        inputField.value = "";
        loadData();
    });
}