import { initLocale, t, translateCategoryName } from "../i18n/i18n.js";

const params = new URLSearchParams(location.search);
const command = params.get("command");

initLocale().then(() => {
  document.getElementById("title").textContent = t("selectCategory");
  document.getElementById("tooltip_1").textContent = t("quickSaveTooltip_1");
  document.getElementById("tooltip_2").textContent = t("quickSaveTooltip_2");

  chrome.storage.sync.get(["savedUrls", "categories"], (data) => {
    const categories = data.categories || Object.keys(data.savedUrls || {});
    const container = document.getElementById("categoryList");

    categories.forEach((category) => {
      if (category === "휴지통") return;

      const btn = document.createElement("button");
      btn.className = "category-btn";
      btn.textContent = translateCategoryName(category);
      btn.addEventListener("click", () => saveToCategory(category));
      container.appendChild(btn);
    });
  });
});

function saveToCategory(category) {
  chrome.storage.local.get(["pendingTabs"], (localData) => {
    const pendingTabs = localData.pendingTabs || [];

    chrome.storage.sync.get(["savedUrls"], (syncData) => {
      const savedUrls = syncData.savedUrls || {};
      const categoryUrls = savedUrls[category] || [];

      pendingTabs.forEach((tab) => {
        const exists = categoryUrls.some(
          (item) => item.url === tab.url && item.title === tab.title
        );
        if (!exists) {
          categoryUrls.push({ title: tab.title, url: tab.url });
        }
      });

      savedUrls[category] = categoryUrls;

      chrome.storage.sync.set({ savedUrls }, () => {
        chrome.storage.local.remove("pendingTabs");

        chrome.runtime.sendMessage({ type: "CATEGORY_UPDATED" }, () => {
          if (chrome.runtime.lastError) return;
        });

        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("icons/icon128.png"),
          title: t("saveComplete"),
          message: t("savedToCategorySelected", { category }),
          priority: 2,
        });

        window.close();
      });
    });
  });
}
