export const ids = {
  sidebarRow: (itemId: string) => "row-" + itemId,
  sidebarRowChildren: (itemId: string) => "row-children-" + itemId,
  card: (itemId: string) => "card-" + itemId,
  subtrack: (itemId: string) => "subtrack-" + itemId,
  searchInput: "search-input",
} as const;

export const cls = {
  page: "page",
  sidebar: "sidebar",
  rightSidebar: "sidebar-right",
  rightSidebarHidden: "sidebar-right-hidden",
  sidebarHidden: "sidebar-hidden",
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
  circlePlaying: "sidebar-row-circle-playing",
  sidebarRowText: "sidebar-row-text",
  sidebarRowInputField: "sidebar-row-text-input",
  sidebarRowExpandButton: "sidebar-row-expand-button",
  sidebarRowExpandButtonContainer: "sidebar-row-expand-button-container",
  sidebarRemoveItemButton: "remove-item",
  sidebarEditItemButton: "edit-item",
  sidebarHideChevrons: "sidebar-hide-chevrons",
  sidebarPlusIcon: "sidebar-plus-icon",
  dragAvatar: "drag-avatar",

  //gallery
  gallery: "gallery",
  scrolly: "scrolly",
  card: "card",
  cardImage: "card-image",
  folderImages: "card-image-for-folder",
  folderImagesEmpty: "card-image-for-empty-folder",
  folderImagesSubContanier: "card-image-for-folder-sub-continaer",
  cardImageWithTextContainer: "card-text-image",

  cardTypeBox: "card-type-box",
  cardTypeBoxTriangle: "card-type-box-triangle",
  cardTypeBoxTrianglePlaylist: "card-type-box-triangle-playlist",
  cardTypeBoxTriangleChannel: "card-type-box-triangle-channel",
  cardTypeBoxTriangleFolder: "card-type-box-triangle-folder",
  cardTypeBoxTextContainer: "card-type-box-text-container",

  cardPreviewContainer: "card-preview-container",
  cardImageHidden: "card-image-hidden",
  cardText: "card-text",
  cardTextForFolder: "card-text-folder",
  subtracksContainer: "card-subtracks-container",
  subtrack: "card-subtrack",
  subtrackImage: "card-subtrack-image",
  galleryEndSpace: "gallery-end-space",

  //player
  player: "player",
  playerHidden: "player-hidden",
  itemBeingPlayed: "item-being-played",

  //gallery1
  card1: "card1",
  column1: "column1",
  //login
  loginContainer: "login-container",
  loginForm: "login-form",
  loginButton: "login-button",
  //utils
  noUserSelect: "no-user-select",
  rotated: "rotated",
  hidden: "hidden",
  deleted: "deleted",
  transparent: "transparent",
  loadGrid: "load-grid",
  loadGridContainer: "load-grid-container",
  none: "",
} as const;

export const zIndexes = {
  leftSidebarMenu: "200",
  rightSidebarMenu: "200",
  dragAvatar: "400",
  dragDestinationIndicator: "350",
  topMenu: "300",
  player: "300",
};

export type ClassName = valueof<typeof cls>;
