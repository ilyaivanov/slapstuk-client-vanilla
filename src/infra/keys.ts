import { findDuplicates } from "./utils";

export const ids = {
  root: "root",
  sidebarRow: (itemId: string) => "row-" + itemId,
  itemIdFromSidebarRow: (rowId: string) => rowId.substr("row-".length),
  card: (itemId: string) => "card-" + itemId,
  subtrack: (itemId: string) => "subtrack-" + itemId,
  itemIdFromSubtrack: (subtrackId: string) =>
    subtrackId.substr("subtrack-".length),

  searchInput: "search-input",
  youtubeIframe: "youtube-player",
} as const;

export const cls = {
  page: "page",
  ctrlKeyPressed: "ctp",
  sidebar: "sidebar",
  sidebarScroll: "sidebar-scrol",
  sidebarWidthAdjuster: "sidebar-w",
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
  itemIcon: "ii",
  sidebarFolderIcon: "sfi",
  sidebarVideoIcon: "svi",
  sidebarChannelIcon: "sci",
  sidebarPlaylistIcon: "spi",
  sidebarRowCircleChannel: "sidebar-row-circle-c",
  sidebarRowCirclePlaylist: "sidebar-row-circle-p",
  circlePlaying: "sidebar-row-circle-playing",
  sidebarRowText: "sidebar-row-text",
  sidebarIconsContainer: "sidebar-icons",
  sidebarIcon: "sidebar-icon",
  sidebarIconDelete: "danger-icon-delete",
  sidebarRowInputField: "sidebar-row-text-input",
  sidebarRowExpandButton: "sidebar-row-expand-button",
  sidebarRowExpandButtonContainer: "sidebar-row-expand-button-container",
  sidebarHideChevrons: "sidebar-hide-chevrons",
  sidebarHeader: "sidebar-header",
  sidebarHeaderIcon: "sidebar-header-icon",
  dragAvatar: "drag-avatar",

  //gallery
  gallery: "gallery",
  galleryScrollyContainer: "gsc",
  scrolly: "scrolly",
  galleyTopLoading: "gtl",
  galleyTopLoadingActive: "gtla",
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
  cardText: "card-text",
  cardTextForFolder: "card-text-folder",
  subtracksContainer: "card-subtracks-container",
  subtrack: "card-subtrack",
  subtrackImage: "csi",
  subtrackPlaylistImage: "cspi",
  subtrackChannelImage: "csci",
  subtrackFolderImage: "csfi",
  galleryEndSpace: "gallery-end-space",

  //player
  player: "player",
  playerHidden: "player-hidden",
  youtubePlayerHidden: "yp-h",
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

const duplicatedClasses = findDuplicates(Object.values(cls));
if (duplicatedClasses.length > 0)
  console.error(`Infra has duplicated clases: ${duplicatedClasses.join(", ")}`);

export const zIndexes = {
  leftSidebarMenu: 200,
  rightSidebarMenu: 200,
  dragAvatar: 400,
  dragDestinationIndicator: 350,
  topMenu: 300,
  player: 300,
};

export type ClassName = valueof<typeof cls>;
