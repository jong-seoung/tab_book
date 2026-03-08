export const messages = {
  ko: {
    // 공통
    confirm: "확인",
    cancel: "취소",
    loading: "로딩 중...",

    // 활성화 카테고리
    activeCategory: "활성화 카테고리",
    saveCurrentTab: "현재 탭 저장",
    saveAllTabs: "전체 탭 저장",

    // 카테고리
    categoryList: "카테고리 목록",
    newCategoryPlaceholder: "새 카테고리 이름",
    add: "추가",
    openAll: "전체 열기",
    deleteAll: "전체 삭제",
    rename: "이름 변경",
    delete: "삭제",
    deleteAllConfirm: '"{category}" 카테고리의 </br> 모든 링크를 삭제합니다.',
    renamePrompt: '"{category}"의 이름을 변경합니다.',
    deleteCategoryPrompt:
      '"{category}" 카테고리를 삭제하려면 이름을 정확히 입력하세요.',
    deleteWrongInput: "틀립니다. 다시 입력해주세요.",
    cannotDeleteLastCategory: "카테고리가 1개일 때는 삭제할 수 없습니다.",

    // 휴지통
    trash: "휴지통",
    emptyTrash: "비우기",
    emptyTrashConfirm: "휴지통을 비웁니다.<br>복원이 불가능합니다.",
    trashEmpty: "휴지통이 비었습니다.",

    // URL
    noSavedUrls: "저장된 URL 없음",
    restore: "복구",

    // 알림 (background)
    saveComplete: "저장 완료",
    savedToCategory: "{category}카테고리에 저장되었습니다.",
    savedTabsToCategory: "{count}개의 탭이 {category}에 저장되었습니다.",

    // Pro 제한 알림
    categoryLimit:
      "무료 버전에서는 최대 3개의 <br>카테고리만 추가할 수 있습니다.",
    urlLimit: "무료 버전에서는 최대 7개까지만 링크를 저장할 수 있습니다.",
    urlSaveFailed: "링크 저장 실패",
    openAllLimit:
      "무료 버전에서는 '전체 열기' 기능이 기본 카테고리로 제한됩니다.",

    // 툴팁
    goToGuide: "상세 가이드로 이동",
    goToShortcuts: "단축키 변경",
    option: "옵션",

    // Quick Save
    quickSave: "빠른 저장",
    selectCategory: "카테고리 선택",
    quickSaveTooltip_1: "저장될 카테고리를 선택해주세요.",
    quickSaveTooltip_2: "활성화 카테고리로 자동 저장하려면 옵션을 설정하세요",
    savedToCategorySelected: "{category}에 저장되었습니다.",

    // 카테고리 이름 표시용
    defaultCategory: "기본",
    trashCategory: "휴지통",
  },

  en: {
    // 공통
    confirm: "OK",
    cancel: "Cancel",
    loading: "Loading...",

    // 활성화 카테고리
    activeCategory: "Active Category",
    saveCurrentTab: "Save Current Tab",
    saveAllTabs: "Save All Tabs",

    // 카테고리
    categoryList: "Category List",
    newCategoryPlaceholder: "New category name",
    add: "Add",
    openAll: "Open All",
    deleteAll: "Delete All",
    rename: "Rename",
    delete: "Delete",
    deleteAllConfirm: 'Delete all links in </br>"{category}" category.',
    renamePrompt: 'Rename "{category}".',
    deleteCategoryPrompt: 'Type the exact name of "{category}" to delete it.',
    deleteWrongInput: "Incorrect. Please try again.",
    cannotDeleteLastCategory: "Cannot delete the last category.",

    // 휴지통
    trash: "Trash",
    emptyTrash: "Empty",
    emptyTrashConfirm: "Empty the trash.<br>This cannot be undone.",
    trashEmpty: "Trash is empty.",

    // URL
    noSavedUrls: "No saved URLs",
    restore: "Restore",

    // 알림 (background)
    saveComplete: "Saved",
    savedToCategory: "Saved to {category} category.",
    savedTabsToCategory: "{count} tabs saved to {category}.",

    // Pro 제한 알림
    categoryLimit: "Free version allows up to <br>3 categories.",
    urlLimit: "Free version allows up to 7 links.",
    urlSaveFailed: "Save Failed",
    openAllLimit:
      "In the free version, 'Open All' is limited to the default category.",

    // 툴팁
    goToGuide: "Go to detailed guide",
    goToShortcuts: "Change shortcuts",
    option: "Option",

    // Quick Save
    quickSave: "Quick Save",
    selectCategory: "Select Category",
    quickSaveTooltip_1: "Select a category to save.",
    quickSaveTooltip_2: "Set the active category for automatic saving.",
    savedToCategorySelected: "Saved to {category}.",

    // 카테고리 이름 표시용
    defaultCategory: "Default",
    trashCategory: "Trash",
  },
};
