type valueof<T> = T[keyof T];

type Item = {
  id: string;
  title: string;
  image?: string;
  videoId?: string;
  playlistId?: string;
  itemType: string;
  children: string[];
  isOpenFromSidebar?: boolean;
  isOpenInGallery?: boolean;
};

type Items = {
  [key: string]: Item;
};

type MyNewItem = CommonItemProperties &
  (
    | (Folder & CommonContainerProperties)
    | (YoutubePlaylist & CommonContainerProperties)
    | (YoutubeChannel & CommonContainerProperties)
    | YoutubeVideo
  );

type CommonItemProperties = {
  id: string;
  title: string;
};

type CommonContainerProperties = {
  children: [];
  isOpenFromSidebar?: boolean;
  isOpenInGallery?: boolean;
};

type Folder = {
  type: "folder";
};

type YoutubePlaylist = {
  type: "playlist";
  playlistId: string;
  image: string;
};

type YoutubeChannel = {
  type: "channel";
  channelId: string;
  image: string;
};

type YoutubeVideo = {
  type: "video";
  videoId: string;
};
