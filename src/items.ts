let allItems: Items = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    children: [],
    title: "Home",
  },
};

export let selectedItemId = "HOME";
export let focusedItemId = "HOME";

export const setItems = (newItesm: Items) => (allItems = newItesm);
export const setSelectedItem = (itemId: string) => (selectedItemId = itemId);
export const setFocusedItem = (itemId: string) => (focusedItemId = itemId);

export const getHomeItems = (): Item[] => getChildren("HOME");

export const getItem = (itemId: string): Item => allItems[itemId];

export const getChildren = (itemId: string): Item[] =>
  allItems[itemId].children.map((id) => allItems[id]);

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

export const findParentItem = (itemId: string): Item | undefined =>
  Object.values(allItems).find((v) => v.children.indexOf(itemId) >= 0);
