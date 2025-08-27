import { showCustomConfirm, showCustomAlertOnly } from "../common/confirm.js";
import { redirectToPayment, cancelPayment } from "./payment.js";
import { loadUserData } from "./loadUserData.js";

export function renderTooltip() {
  const toolTipDiv = document.getElementById("tool-tips");

  const infoIcon = document.createElement("p");
  infoIcon.textContent = "ⓘ";
  infoIcon.style.color = "gray";
  infoIcon.style.fontSize = "14px";
  infoIcon.style.cursor = "pointer";
  infoIcon.style.position = "relative";

  const tooltip = document.createElement("span");
  chrome.commands.getAll((commands) => {
    const lines = [];
    lines.push(
      `<a class="a-decoration" href="https://jongseoung.tistory.com/380" target="_blank" style="color: #fff;">상세 가이드로 이동</a>`
    );
    chrome.storage.sync.get(["userInfo"], (data) => {
      const userInfo = data.userInfo;
      const expireTime = new Date(userInfo.expireDate).getTime();

      if (userInfo.isActive) {
        lines.push(`
      <button id="subscription-action-btn" style="...">
        구독 만료일: ${userInfo.expireDate}</br>
        구독 취소 하기
      </button>
    `);
      } else if (expireTime > Date.now()) {
        // 구독 취소했지만 혜택이 남아 있는 상태
        lines.push(`
      <button class="a-decoration" id="subscription-action-btn" style="color: #fff; background: none; border: none; cursor: pointer; width: 100%;">
        구독 만료일: ${userInfo.expireDate}</br>
        혜택 종료까지 대기 중
      </button>
    `);
      } else {
        // 완전히 구독이 끝난 상태
        lines.push(`
      <button class="a-decoration" id="subscription-action-btn" style="color: #fff; background: none; border: none; cursor: pointer; width: 100%;">
        구독 페이지로 이동
      </button>
    `);
      }

      tooltip.innerHTML = lines.join("");

      const actionBtn = tooltip.querySelector("#subscription-action-btn");
      if (!actionBtn) return;

      actionBtn.addEventListener("click", () => {
        if (isActive && userInfo.expireDate) {
          showCustomConfirm(
            `구독을 취소합니다.</br>만료일까지 구독 기능은 활성화 됩니다.`,
            (isConfirmed) => {
              if (isConfirmed) {
                loadUserData()
                  .then((token) => {
                    cancelPayment(token);
                    showCustomAlertOnly(
                      "구독이 취소되었습니다.</br> 확장 프로그램을 다시 열어주세요."
                    );
                  })
                  .catch((err) => {
                    console.error("토큰을 가져오는 데 실패했습니다.", err);
                  });
              } else {
                console.log("취소되었습니다.");
              }
            }
          );
        } else {
          loadUserData()
            .then((token) => {
              redirectToPayment(token);
            })
            .catch((err) => {
              console.error("토큰을 가져오는 데 실패했습니다.", err);
            });
        }
      });
    });
  });

  tooltip.style.visibility = "hidden";
  tooltip.style.width = "200px";
  tooltip.style.backgroundColor = "rgba(85, 85, 85, 0.7)";
  tooltip.style.color = "#fff";
  tooltip.style.textAlign = "center";
  tooltip.style.borderRadius = "6px";
  tooltip.style.padding = "8px";
  tooltip.style.position = "absolute";
  tooltip.style.zIndex = "1";
  tooltip.style.top = "120%";
  tooltip.style.transform = "translateX(-95%)";
  tooltip.style.opacity = "0";
  tooltip.style.transition = "opacity 0.2s";
  tooltip.style.fontSize = "13px";
  tooltip.style.pointerEvents = "auto";
  tooltip.style.whiteSpace = "normal";
  tooltip.style.boxSizing = "border-box";

  let hideTooltipTimeout;

  infoIcon.addEventListener("mouseenter", () => {
    clearTimeout(hideTooltipTimeout);
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
  });

  tooltip.addEventListener("mouseenter", () => {
    clearTimeout(hideTooltipTimeout);
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
  });

  infoIcon.addEventListener("mouseleave", () => {
    hideTooltipTimeout = setTimeout(() => {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    }, 300);
  });

  tooltip.addEventListener("mouseleave", () => {
    hideTooltipTimeout = setTimeout(() => {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    }, 300);
  });

  infoIcon.appendChild(tooltip);

  toolTipDiv.append(infoIcon);
}
