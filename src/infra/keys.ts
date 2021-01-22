export const ids = {
  sidebarRow: (itemId: string) => "row-" + itemId,
  sidebarRowChildren: (itemId: string) => "row-children-" + itemId,
} as const;

export const cls = {
  page: "page",
  sidebar: "sidebar",
  grabbing: "page-grabbing",
  header: "header",
  sidebarFocusContainer: "sidebar-focus-container",
  sidebarFocusContainerFocused: "sidebar-focus-container-focused",
  sidebarRow: "sidebar-row",
  sidebarRowSelected: "sidebar-row-selected",
  sidebarRowFocused: "sidebar-row-focused",
  sidebarRowChildrenContainer: "sidebar-row-children-container",
  sidebarRowChildrenContainerHighlighted:
    "sidebar-row-children-container-highlighted",
  sidebarRowChildrenContainerFocused: "sidebar-row-children-container-focused",
  sidebarRowCircle: "sidebar-row-circle",
  sidebarRowText: "sidebar-row-text",
  sidebarRowExpandButton: "sidebar-row-expand-button",
  sidebarRowExpandButtonContainer: "sidebar-row-expand-button-container",
  sidebarRemoveItemButton: "remove-item-button",
  sidebarHideChevrons: "sidebar-hide-chevrons",

  unfocusButton: "unfocus-button",

  dragAvatar: "drag-avatar",

  //gallery
  gallery: "gallery",
  card: "card",
  cardImage: "card-image",
  cardImageHidden: "card-image-hidden",
  cardText: "card-text",
  cardTextForFolder: "card-text-folder",
  subtracksContainer: "card-subtracks-container",
  subtrack: "card-subtrack",
  subtrackImage: "card-subtrack-image",
  galleryEndSpace: "gallery-end-space",

  //utils
  noUserSelect: "no-user-select",
  rotated: "rotated",
  hidden: "hidden",
  deleted: "deleted",
  transparent: "transparent",
  none: "",
} as const;

export type ClassName = valueof<typeof cls>;
