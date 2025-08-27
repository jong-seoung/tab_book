
export function openUrlListByCategory(category) {
  const categoryHeader = document.querySelector(
    `.category-header[data-category="${category}"]`
  );

  if (!categoryHeader) {
    console.warn("해당 카테고리를 찾을 수 없습니다:", category);
    return;
  }

  // .url-list 엘리먼트 찾기
  const urlList = categoryHeader.nextElementSibling;
  if (!urlList || !urlList.classList.contains("url-list")) {
    console.warn("URL 리스트를 찾을 수 없습니다.");
    return;
  }

  urlList.style.display = urlList.style.display === "block" ? "none" : "block";
}
