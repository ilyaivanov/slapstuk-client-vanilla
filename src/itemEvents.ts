import { anim, cls, colors, dom, ids } from "./infra";
import * as items from "./items";
import * as view from "./sidebar/view";
import * as gallery from "./gallery/gallery";

export const onChildRemoved = (
  itemId: string,
  itemRemoved: string,
  isPermanent /*permanent removal is animated differently*/ = false
) => {
  const item = items.getItem(itemId);
  if (itemId !== "HOME") view.updateItemChevron(item);

  const card = dom.maybefindById(ids.card(itemRemoved));
  if (card) {
    card
      .animate(
        [
          {
            opacity: 0,
            backgroundColor: colors.danger,
          },
        ],
        { duration: 300 }
      )
      .addEventListener("finish", () => {
        card.remove();
        gallery.rerenderGallery();
      });
  }

  if (items.isContainer(item) && items.isOpenAtGallery(item)) {
    const card = dom.maybefindById(ids.card(itemId));
    if (card) {
      const subtrack = dom
        .findAllByClass(cls.subtrack, card)
        .find((s) => s.id === ids.subtrack(itemRemoved));

      if (subtrack && !isPermanent) {
        anim
          .animateHeight(subtrack, subtrack.clientHeight, 0, {
            duration: 300,
          })
          .addEventListener("finish", () => subtrack.remove());
      }
      if (subtrack) {
        anim
          .animateHeight(subtrack, subtrack.clientHeight, 0, {
            duration: 300,
          })
          .addEventListener("finish", () => subtrack.remove());
      }
    }
  }
};

export const showItemNear = (
  itemIdNearToShow: string,
  placement: "before" | "after"
) => {};
