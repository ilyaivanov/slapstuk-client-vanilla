import * as sidebarController from "./sidebar/controller";

export const getItem = (itemId: string): Item =>
  sidebarController.items[itemId];

export const getNextItem = (itemId: string): Item | undefined => {
  const parent = findParentItem(itemId);
  if (parent) {
    const index = parent.children.indexOf(itemId);

    if (index < parent.children.length - 1) {
      return getItem(parent.children[index + 1]);
    }
  }
  return undefined;
};

export const findParentItem = (itemId: string) =>
  Object.values(sidebarController.items).find(
    (v) => v.children.indexOf(itemId) >= 0
  );
