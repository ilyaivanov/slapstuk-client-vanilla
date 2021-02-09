import { dom, ids, isIsolated } from "../infra";
import * as api from "../api/youtubeRequest";
import * as gallery from "../gallery1/gallery";
import * as items from "../items";
import { ResponseItem } from "../api/youtubeRequest";

export const search = () => {
  const input = dom.findById(ids.searchInput) as HTMLInputElement;
  if (input.value || isIsolated) {
    const searchItem = items.getItem("SEARCH") as SearchContainer;
    gallery.renderLoadingIndicator(searchItem);
    api.findYoutubeVideos(input.value).then((data) => {
      const itemsMapped = data.items.map(mapReponseItem);
      searchItem.searchTerm = input.value;
      searchItem.nextPageToken = data.nextPageToken;
      items.setChildren("SEARCH", itemsMapped);

      items.setSelectedItem("SEARCH");
      gallery.renderItems(itemsMapped);
    });
  }
};

const searchForNextPage = (
  item: SearchContainer
): Promise<LoadingItemsReponse> =>
  api
    .findYoutubeVideos(item.searchTerm, item.nextPageToken)
    .then((response) => ({
      items: response.items.map(mapReponseItem),
      nextPageToken: response.nextPageToken,
    }));

const getChannelSubitems = (
  item: YoutubeChannel
): Promise<LoadingItemsReponse> =>
  item.nextPageToken
    ? api
        .getChannelPlaylists(item.channelId, item.nextPageToken)
        .then((response) => ({
          items: response.items.map(mapReponseItem),
          nextPageToken: response.nextPageToken,
        }))
    : Promise.all([
        api.getChannelPlaylists(item.channelId),
        api.getChannelUploadsPlaylistId(item.channelId),
      ]).then(([channelPlaylists, uploadsPlaylistId]) => ({
        nextPageToken: channelPlaylists.nextPageToken,
        items: [
          {
            type: "YTplaylist",
            children: [],
            id: Math.random() + "",
            image: item.image,
            playlistId: uploadsPlaylistId,
            title: item.title + " - Uploads",
            isCollapsedInGallery: true,
          } as Item,
        ].concat(channelPlaylists.items.map(mapReponseItem)),
      }));

const getPlaylistSubitems = (
  item: YoutubePlaylist
): Promise<LoadingItemsReponse> =>
  api
    .fetchPlaylistVideos(item.playlistId, item.nextPageToken)
    .then((response) => ({
      nextPageToken: response.nextPageToken,
      items: response.items.map(mapReponseItem),
    }));

export const loadItemChildren = (item: Item): Promise<LoadingItemsReponse> => {
  if (items.isPlaylist(item)) return getPlaylistSubitems(item);
  else if (items.isChannel(item)) return getChannelSubitems(item);
  else if (items.isSearch(item)) return searchForNextPage(item);
  else throw Error(`Can't figure out how to load ${item.type}`);
};

export type LoadingItemsReponse = {
  items: Item[];
  nextPageToken?: string;
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
