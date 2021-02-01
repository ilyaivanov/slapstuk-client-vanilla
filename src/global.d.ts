type valueof<T> = T[keyof T];

// type Item = {
//   id: string;
//   title: string;
//   image?: string;
//   videoId?: string;
//   playlistId?: string;
//   itemType: string;
//   children: string[];
//   isOpenFromSidebar?: boolean;
//   isOpenInGallery?: boolean;
// };

type Items = {
  [key: string]: Item;
};

type Item = ItemContainer | YoutubeVideo;

type ItemContainer = YoutubePlaylist | YoutubeChannel | Folder;

type CommonItemProperties = {
  id: string;
  title: string;
};

type CommonContainerProperties = {
  children: string[];
  isOpenFromSidebar?: boolean;
  isOpenInGallery?: boolean;
};

type Folder = {
  type: "folder";
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubePlaylist = {
  type: "YTplaylist";
  playlistId: string;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeChannel = {
  type: "YTchannel";
  channelId: string;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeVideo = {
  type: "YTvideo";
  videoId: string;
} & CommonItemProperties;
