type valueof<T> = T[keyof T];

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
  isLoading?: boolean;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeChannel = {
  type: "YTchannel";
  channelId: string;
  isLoading?: boolean;
  image: string;
} & CommonItemProperties &
  CommonContainerProperties;

type YoutubeVideo = {
  type: "YTvideo";
  videoId: string;
} & CommonItemProperties;
