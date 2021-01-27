export const ids = {
  sidebarRow: (itemId: string) => "row-" + itemId,
  sidebarRowChildren: (itemId: string) => "row-children-" + itemId,
  card: (itemId: string) => "card-" + itemId,
  subtrack: (itemId: string) => "subtrack-" + itemId,
  searchInput: 'search-input'
} as const;

export const cls = {
  page: "page",
  sidebar: "sidebar",
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
  sidebarRowExpandButton: "sidebar-row-expand-button",
  sidebarRowExpandButtonContainer: "sidebar-row-expand-button-container",
  sidebarRemoveItemButton: "remove-item-button",
  sidebarHideChevrons: "sidebar-hide-chevrons",
  sidebarPlusIcon :'sidebar-plus-icon',
  dragAvatar: "drag-avatar",

  //gallery
  gallery: "gallery",
  card: "card",
  cardImage: "card-image",
  cardImageWithTextContainer: "card-text-image",
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
  none: "",
} as const;

export const zIndexes = {
  leftSidebarMenu: "200",
  dragAvatar: "400",
  dragDestinationIndicator: "350",
  topMenu: "300",
  player: "300",
};

export type ClassName = valueof<typeof cls>;
