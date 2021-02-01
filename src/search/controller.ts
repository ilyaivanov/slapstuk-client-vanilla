import { dom, ids } from "../infra";
import * as api from "../api/youtubeRequest";
import * as gallery from "../gallery/controller";
import * as items from "../items";

export const search = () => {
  const input = dom.findById(ids.searchInput) as HTMLInputElement;
  if (input.value) {
    api.findYoutubeVideos(input.value).then((data) => {
      console.log(data.items);
      const itemsMapped = data.items.map((i: any) => ({
        ...i,
        //TODO: map items properly here
        itemType: i.itemType == "playlist" ? "folder" : i.itemType,
        playlistId: i.itemType == "playlist" ? i.itemId : undefined,
        videoId: i.itemType == "video" ? i.itemId : undefined,
        title: i.name,
        children: [],
      }));
      items.setSearchItems(itemsMapped);
      gallery.renderItems(itemsMapped);
    });
  }
};