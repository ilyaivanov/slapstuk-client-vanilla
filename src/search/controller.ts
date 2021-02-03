import { dom, ids } from "../infra";
import * as api from "../api/youtubeRequest";
import * as gallery from "../gallery1/gallery";
import * as items from "../items";
import { ResponseItem } from "../api/youtubeRequest";

export const search = () => {
  const input = dom.findById(ids.searchInput) as HTMLInputElement;
  if (input.value) {
    api.findYoutubeVideos(input.value).then((data) => {
      const itemsMapped = data.items.map(mapReponseItem);
      items.setSearchItems(itemsMapped);
      gallery.renderItems(itemsMapped);
    });
  }
};

export const mapReponseItem = (resItem: ResponseItem): Item => {
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
