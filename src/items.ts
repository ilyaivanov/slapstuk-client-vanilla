let defaultItems = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    children: [],
    title: "Home",
  },
  SEARCH: {
    id: "SEARCH",
    itemType: "folder",
    children: [],
    title: "SEARCH",
  },
};

let allItems: Items = { ...defaultItems };

export let selectedItemId = "HOME";
export let focusedItemId = "HOME";

export const setItems = (newItesm: Items) =>
  (allItems = {
    ...defaultItems,
    ...newItesm,
  });
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

export const setSearchItems = (items: Item[]) => setChildren("SEARCH", items);

export const setChildren = (parentId: string, items: Item[]) => {
  allItems[parentId].children = items.map((i) => i.id);
  items.forEach((item) => {
    allItems[item.id] = item;
  });
};

export const appendChildTo = (parentId: string, item: Item) => {
  allItems[parentId].children = [item.id].concat(allItems[parentId].children);
  allItems[item.id] = item;
};

export const findParentItem = (itemId: string): Item | undefined =>
  Object.values(allItems).find((v) => v.children.indexOf(itemId) >= 0);

//TODO: this is a legacy leftovers from my dumb decision regarding items structure
//I can't fix it right now, since https://slapstuk.web.app/ already rely on it
export const isFolder = (item: Item) => {
  return item.itemType == "folder" && !item.image;
};
export const isPlaylist = (item: Item) => {
  return item.itemType == "folder" && item.image;
};

export const isPlaylistNeedToBeLoaded = (item: Item) => {
  return isPlaylist(item) && item.children.length == 0;
};

export const isPlaylistLoading = (item: Item) => {
  return isPlaylist(item) && item.children.length == 0;
};

export const isVideo = (item: Item) => {
  return item.itemType == "video";
};

export const isChannel = (item: Item) => {
  return item.itemType == "channel";
};
