let defaultItems: Items = {
  HOME: {
    id: "HOME",
    type: "folder",
    children: [],
    title: "Home",
  },
  SEARCH: {
    id: "SEARCH",
    type: "folder",
    children: [],
    title: "SEARCH",
  },
};

export let allItems: Items = { ...defaultItems };

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

export const getChildren = (itemId: string): Item[] => {
  const item = allItems[itemId];
  if (isContainer(item)) return item.children.map((id) => allItems[id]);
  else return [];
};

export const getNextItem = (itemId: string): Item | undefined => {
  const parent = findParentItem(itemId);
  if (parent && isContainer(parent)) {
    const index = parent.children.indexOf(itemId);

    if (index < parent.children.length - 1) {
      return getItem(parent.children[index + 1]);
    }
  }
  return undefined;
};

export const setSearchItems = (items: Item[]) => setChildren("SEARCH", items);

export const setChildren = (parentId: string, items: Item[]) => {
  const parent = allItems[parentId];
  if (isContainer(parent)) {
    parent.children = items.map((i) => i.id);
    items.forEach((item) => {
      allItems[item.id] = item;
    });
  }
};

export const hasChildren = (item: Item) =>
  isContainer(item) && item.children.length > 0;

export const isOpenAtSidebar = (item: Item) =>
  isContainer(item) &&
  (typeof item.isOpenFromSidebar != "undefined"
    ? item.isOpenFromSidebar
    : false);

export const isOpenAtGallery = (item: Item) =>
  isContainer(item) &&
  (typeof item.isOpenInGallery != "undefined" ? item.isOpenInGallery : true);

export const appendChildTo = (parentId: string, item: Item) => {
  const parent = allItems[parentId];
  if (isContainer(parent)) {
    parent.children = [item.id].concat(parent.children);
    allItems[item.id] = item;
  }
};

export const findParentItem = (itemId: string): ItemContainer | undefined =>
  Object.values(allItems).find(
    (v) => isContainer(v) && v.children.indexOf(itemId) >= 0
  ) as ItemContainer;

export const isFolder = (item: Item): item is Folder => {
  return item.type == "folder";
};
export const isPlaylist = (item: Item): item is YoutubePlaylist => {
  return item.type == "YTplaylist";
};

export const isPlaylistNeedToBeLoaded = (item: Item): boolean => {
  return isPlaylist(item) && item.children.length == 0;
};

export const isPlaylistLoading = (item: Item): boolean => {
  return isPlaylist(item) && item.children.length == 0;
};

export const isVideo = (item: Item): item is YoutubeVideo => {
  return item.type == "YTvideo";
};

export const isChannel = (item: Item): item is YoutubeChannel => {
  return item.type == "YTchannel";
};

export function isContainer(item: Item): item is ItemContainer {
  return (
    item.type == "YTchannel" ||
    item.type == "folder" ||
    item.type == "YTplaylist"
  );
}
