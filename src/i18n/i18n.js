import { messages } from "./messages.js";

let currentLocale = "ko";

export function t(key, params = {}) {
  const msg = messages[currentLocale]?.[key] || messages["ko"]?.[key] || key;
  return msg.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`);
}

export function initLocale() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["locale"], (data) => {
      if (data.locale) {
        currentLocale = data.locale;
      } else {
        const browserLang = navigator.language || navigator.languages?.[0] || "ko";
        currentLocale = browserLang.startsWith("ko") ? "ko" : "en";
        chrome.storage.sync.set({ locale: currentLocale });
      }
      resolve(currentLocale);
    });
  });
}

export function setLocale(locale) {
  currentLocale = locale;
  chrome.storage.sync.set({ locale });
}

export function getLocale() {
  return currentLocale;
}

export function applyI18nToDOM() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });
}

export function translateCategoryName(name) {
  if (name === "기본") return t("defaultCategory");
  if (name === "휴지통") return t("trashCategory");
  return name;
}
