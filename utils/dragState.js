export let currentDragType = null; // "category" 또는 "url" 또는 null

export function setDragType(type) {
  currentDragType = type;
}

export function clearDragType() {
  currentDragType = null;
}