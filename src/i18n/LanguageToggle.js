import { getLocale, setLocale } from "./i18n.js";

const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

export function createLanguageDropdown(onLanguageChange) {
  const select = document.createElement("select");
  select.className = "language-select";
  select.style.cursor = "pointer";
  select.style.border = "none";
  select.style.borderRadius = "4px";
  select.style.padding = "4px 6px";
  select.style.fontSize = "12px";
  select.style.backgroundColor = "transparent";
  select.style.color = "#fff";
  select.style.outline = "none";
  select.style.width = "100%";
  select.style.marginTop = "6px";

  LANGUAGES.forEach(({ code, label }) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = label;
    option.style.color = "#333";
    select.appendChild(option);
  });

  select.value = getLocale();

  select.addEventListener("change", () => {
    setLocale(select.value);
    if (onLanguageChange) {
      onLanguageChange(select.value);
    }
  });

  return select;
}
