import { t, applyI18nToDOM } from "../i18n/i18n.js";
import { createLanguageDropdown } from "../i18n/LanguageToggle.js";
import { loadData } from "../../loadData.js";

export function renderTooltip() {
  const toolTipDiv = document.getElementById("tool-tips");

  if (toolTipDiv.querySelector("p")) {
    return;
  }

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
      `<a class="a-decoration" href="https://jongseoung.tistory.com/380" target="_blank" style="color: #fff;">${t("goToGuide")}</a>`
    );

    tooltip.innerHTML = "";

    // 가이드 링크 영역
    const guideSection = document.createElement("div");
    guideSection.style.padding = "6px 0";
    guideSection.innerHTML = lines.join("");

    const shortcutLink = document.createElement("a");
    shortcutLink.textContent = t("goToShortcuts");
    shortcutLink.href = "#";
    shortcutLink.style.color = "#fff";
    shortcutLink.style.display = "block";
    shortcutLink.style.marginTop = "4px";
    shortcutLink.className = "a-decoration";
    shortcutLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
    });
    guideSection.appendChild(shortcutLink);

    // 구분선
    const divider = document.createElement("div");
    divider.style.borderTop = "1px solid rgba(255, 255, 255, 0.3)";
    divider.style.margin = "0";

    // Option 영역
    const optionSection = document.createElement("div");
    optionSection.style.padding = "6px 0 4px";

    const optionLabel = document.createElement("div");
    optionLabel.textContent = t("option");
    optionLabel.style.fontSize = "11px";
    optionLabel.style.color = "rgba(255, 255, 255, 0.7)";
    optionLabel.style.marginBottom = "6px";

    // Language 행
    const langRow = document.createElement("div");
    langRow.style.display = "flex";
    langRow.style.alignItems = "center";
    langRow.style.justifyContent = "space-between";
    langRow.style.marginBottom = "6px";

    const langLabel = document.createElement("div");
    langLabel.textContent = "Language";
    langLabel.style.fontSize = "11px";
    langLabel.style.color = "rgba(255, 255, 255, 0.5)";

    const langDropdown = createLanguageDropdown((newLocale) => {
      applyI18nToDOM();
      loadData();
    });

    langRow.append(langLabel, langDropdown);

    // Quick Save 행
    const quickSaveRow = document.createElement("div");
    quickSaveRow.style.display = "flex";
    quickSaveRow.style.alignItems = "center";
    quickSaveRow.style.justifyContent = "space-between";

    const quickSaveLabel = document.createElement("div");
    quickSaveLabel.textContent = t("quickSave");
    quickSaveLabel.style.fontSize = "11px";
    quickSaveLabel.style.color = "rgba(255, 255, 255, 0.5)";

    const toggleWrapper = document.createElement("label");
    toggleWrapper.style.position = "relative";
    toggleWrapper.style.display = "inline-block";
    toggleWrapper.style.width = "32px";
    toggleWrapper.style.height = "18px";
    toggleWrapper.style.cursor = "pointer";

    const quickSaveToggle = document.createElement("input");
    quickSaveToggle.type = "checkbox";
    quickSaveToggle.style.opacity = "0";
    quickSaveToggle.style.width = "0";
    quickSaveToggle.style.height = "0";

    const slider = document.createElement("span");
    slider.style.position = "absolute";
    slider.style.inset = "0";
    slider.style.backgroundColor = "#555";
    slider.style.borderRadius = "18px";
    slider.style.transition = "background-color 0.2s";

    const knob = document.createElement("span");
    knob.style.position = "absolute";
    knob.style.height = "14px";
    knob.style.width = "14px";
    knob.style.left = "2px";
    knob.style.bottom = "2px";
    knob.style.backgroundColor = "#fff";
    knob.style.borderRadius = "50%";
    knob.style.transition = "transform 0.2s";

    slider.appendChild(knob);
    toggleWrapper.append(quickSaveToggle, slider);

    function updateToggleVisual(checked) {
      slider.style.backgroundColor = checked ? "#4CAF50" : "#555";
      knob.style.transform = checked ? "translateX(14px)" : "translateX(0)";
    }

    chrome.storage.sync.get(["quickSave"], (result) => {
      quickSaveToggle.checked = result.quickSave !== false;
      updateToggleVisual(quickSaveToggle.checked);
    });

    quickSaveToggle.addEventListener("change", () => {
      updateToggleVisual(quickSaveToggle.checked);
      chrome.storage.sync.set({ quickSave: quickSaveToggle.checked });
    });

    quickSaveRow.append(quickSaveLabel, toggleWrapper);

    optionSection.append(optionLabel, langRow, quickSaveRow);

    tooltip.append(guideSection, divider, optionSection);
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
