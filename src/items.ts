export let defaultItems: Items = {
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
export const setSelectedItem = (itemId: string) => (selectedItemId = itemId);

export const setItems = (newItesm: Items) =>
  (allItems = {
    ...defaultItems,
    ...newItesm,
  });

export let focusedItemId = "HOME";
export let focusStack: string[] = [];
export const pushToFocusStack = (itemId: string) => {
  console.trace("puishing");
  focusedItemId = itemId;
  focusStack.push(itemId);
};
export const popFromFocusStack = (): string => {
  if (focusStack.length > 0) {
    focusStack.pop();
    focusedItemId = focusStack[focusStack.length - 1] || "HOME";
    return focusedItemId;
  } else return "HOME";
};

export const setFocusStack = (stack: string[]) => {
  if (stack && stack.length > 0) {
    focusStack = stack;
    focusedItemId = stack[stack.length - 1];
  }
};

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
  isContainer(item) && !item.isCollapsedInGallery;

export const toggleIsCollapsedInGallery = (item: ItemContainer) => {
  if (!item.isCollapsedInGallery) {
    item.isCollapsedInGallery = true;
  } else {
    delete item.isCollapsedInGallery;
  }
};

export const prependChildTo = (parentId: string, item: Item) => {
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

export const isNeedsToBeLoaded = (item: Item): boolean => {
  return (
    (isPlaylist(item) && item.children.length == 0 && !item.isLoading) ||
    (isChannel(item) && item.children.length == 0 && !item.isLoading)
  );
};

export const startLoading = (item: Item) => {
  if (isPlaylist(item)) item.isLoading = true;
  else if (isChannel(item)) item.isLoading = true;
};

export const stopLoading = (item: ItemContainer) => {
  if (isPlaylist(item)) delete item.isLoading;
  else if (isChannel(item)) delete item.isLoading;
};
export const isLoading = (item: Item): boolean => {
  return (
    (isPlaylist(item) && !!item.isLoading) ||
    (isChannel(item) && !!item.isLoading)
  );
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

export const isContainerNeedToFetch = (item: ItemContainer) => {
  //TODO: probably need to add additional flags to loading status for Youtube playlist and channel
  return item.children.length == 0 && !isLoading(item);
};

export const getPreviewImages = (item: Item, count: number): string[] =>
  getChildren(item.id)
    .map(getFirstImage)
    .filter((x) => !!x)
    .slice(0, count) as string[];

export const getFirstImage = (item: Item): string | undefined => {
  if (isFolder(item)) {
    const children = getChildren(item.id);
    return children.map(getFirstImage).filter((x) => !!x)[0] as string;
  }
  return getImageSrc(item) as string;
};

export const getFirstVideo = (item: Item): YoutubeVideo | undefined => {
  if (isContainer(item)) {
    const children = getChildren(item.id);
    return children.map(getFirstVideo).filter((x) => !!x)[0] as YoutubeVideo;
  } else if (isVideo(item)) return item;
};

export const getImageSrc = (item: Item): string | undefined => {
  if (isVideo(item))
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else if (isPlaylist(item) || isChannel(item)) return item.image;
  else return undefined;
};
