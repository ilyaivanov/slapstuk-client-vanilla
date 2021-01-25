import { dom, ids } from "../infra";
import * as api from "../youtubeRequest";
import * as gallery from "../gallery/controller";
import * as items from "../items";

export const search = () => {
  const input = dom.findById(ids.searchInput) as HTMLInputElement;
  if (input.value) {
    api.findYoutubeVideos(input.value).then((data) => {
      const itemsMapped = data.items.map((i: any) => ({
        ...i,
        //TODO: map items properly here
        videoId: i.type == "video" ? i.itemId : undefined,
        title: i.name,
        children: [],
      }));
      items.setSearchItems(itemsMapped);
      gallery.renderItems(itemsMapped);
    });
  }
};
