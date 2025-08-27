function createModal(contentHTML, onClose) {
  document.querySelector(".custom-modal")?.remove();
  const modal = document.createElement("div");
  modal.className = "custom-modal";
  modal.innerHTML = `
    <div class="custom-modal-content">
        ${contentHTML}
    </div>
    `;

  if (!document.querySelector("#custom-modal-style")) {
    const style = document.createElement("style");
    style.id = "custom-modal-style";
    style.textContent = `
        .custom-modal {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-in-out;
        }

        .custom-modal-content {
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
        }

        .custom-modal p {
        font-size: 18px;
        margin-bottom: 20px;
        color: #333;
        font-weight: 500;
        }

        .custom-modal-buttons {
        display: flex;
        justify-content: center;
        gap: 15px;
        }

        .custom-modal-buttons button {
        padding: 12px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 8px;
        border: none;
        outline: none;
        transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .custom-modal-buttons button:hover {
        background-color:rgb(178, 213, 250);
        color: white;
        transform: translateY(-2px);
        }

        .custom-modal-buttons button:active {
        transform: translateY(1px);
        }

        .custom-modal input {
        width: 80%;
        padding: 12px;
        margin-top: 20px;
        border-radius: 8px;
        border: 1px solid #ddd;
        font-size: 16px;
        transition: border-color 0.3s ease;
        }

        .custom-modal input:focus {
        border-color: rgb(178, 213, 250);
        outline: none;
        }

        @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
        }

        @keyframes slideIn {
        0% { transform: translateY(-50px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      onClose();
      modal.remove();
    }
  });

  return modal;
}

export function showCustomConfirm(message, onConfirm, onCancel = () => {}) {
  const modal = createModal(
    `
    <p>${message}</p>
    <div class="custom-modal-buttons">
      <button id="confirmBtn">확인</button>
      <button id="cancelBtn">취소</button>
    </div>
  `,
    () => {
      onCancel();
    }
  );

  modal.querySelector("#confirmBtn").addEventListener("click", () => {
    onConfirm(true);
    modal.remove();
  });

  modal.querySelector("#cancelBtn").addEventListener("click", () => {
    onCancel(false);
    modal.remove();
  });
}



export function showCustomAlertOnly(message, onClose = () => {}) {
  const modal = createModal(`
    <p>${message}</p>
    <div class="custom-modal-buttons">
      <button id="okBtn">확인</button>
    </div>
  `, () => {
    onClose();
  });

  modal.querySelector("#okBtn").addEventListener("click", () => {
    onClose();
    modal.remove();
  });
}

export function showCustomPrompt(message, defaultValue, onSubmit, onCancel = () => {}) {
  const modal = createModal(`
    <p>${message}</p>
    <input style="margin-top: 0px;" type="text" id="promptInput" value="${defaultValue || ""}">
    <div class="custom-modal-buttons" style="margin-top: 20px;">
      <button id="submitBtn">확인</button>
      <button id="cancelBtn">취소</button>
    </div>
  `, () => {
    onCancel();
  });

  const input = modal.querySelector("#promptInput");
  input.focus();

  modal.querySelector("#submitBtn").addEventListener("click", () => {
    onSubmit(input.value);
    modal.remove();
  });

  modal.querySelector("#cancelBtn").addEventListener("click", () => {
    onCancel();
    modal.remove();
  });

    input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      onSubmit(input.value);
      modal.remove();
    }
  });
}