import { dom, ids, isIsolated } from "../infra";
import * as api from "../api/youtubeRequest";
import * as gallery from "../gallery1/gallery";
import * as items from "../items";
import { ResponseItem } from "../api/youtubeRequest";

export const search = () => {
  const input = dom.findById(ids.searchInput) as HTMLInputElement;
  if (input.value || isIsolated) {
    api.findYoutubeVideos(input.value).then((data) => {
      const itemsMapped = data.items.map(mapReponseItem);
      items.setSearchItems(itemsMapped);
      gallery.renderItems(itemsMapped);
    });
  }
};

const getChannelSubitems = (item: YoutubeChannel) =>
  Promise.all([
    api.getChannelPlaylists(item.channelId),
    api.getChannelUploadsPlaylistId(item.channelId),
  ]).then(([channelPlaylists, uploadsPlaylistId]) =>
    [
      {
        type: "YTplaylist",
        children: [],
        id: Math.random() + "",
        image: item.image,
        playlistId: uploadsPlaylistId,
        title: item.title + " - Uploads",
        isCollapsedInGallery: true,
      } as Item,
    ].concat(channelPlaylists.items.map(mapReponseItem))
  );

const getPlaylistSubitems = (item: YoutubePlaylist) =>
  api
    .fetchPlaylistVideos(item.playlistId)
    .then((response) => response.items.map(mapReponseItem));

export const loadItemChildren = (item: Item): Promise<Item[]> => {
  if (items.isPlaylist(item)) return getPlaylistSubitems(item);
  else if (items.isChannel(item)) return getChannelSubitems(item);
  else throw Error(`Can't figure out how to load ${item.type}`);
};

const mapReponseItem = (resItem: ResponseItem): Item => {
  if (resItem.itemType == "video")
    return {
      type: "YTvideo",
      id: resItem.id,
      title: resItem.name,
      videoId: resItem.itemId,
    };
  else if (resItem.itemType == "channel")
    return {
      type: "YTchannel",
      id: resItem.id,
      title: resItem.name,
      channelId: resItem.itemId,
      image: resItem.image,
      isCollapsedInGallery: true,
      children: [],
    };
  else
    return {
      type: "YTplaylist",
      id: resItem.id,
      title: resItem.name,
      playlistId: resItem.itemId,
      image: resItem.image,
      isCollapsedInGallery: true,
      children: [],
    };
};
