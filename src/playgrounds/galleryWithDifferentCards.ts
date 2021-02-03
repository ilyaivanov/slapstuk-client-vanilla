import * as gallery from "../gallery1/gallery";
import { cls, dom } from "../infra";
import { toggleLeftSidebar, togleRightSidebar } from "../sidebar/controller";
import * as player from "../player/controller";
import * as items from "../items";
import { initSampleSearchResults } from "./initSampleSearchResults";

initSampleSearchResults();
const root = dom.findById("root");
root.appendChild(
  dom.div({
    className: cls.page,
    children: [
      {
        className: cls.header,
        children: [
          {
            type: "button",
            on: { click: toggleLeftSidebar },
            children: "left",
          },
          {
            type: "button",
            on: { click: togleRightSidebar },
            children: "right",
          },
          {
            type: "button",
            on: { click: player.toggleVisibility },
            children: "player",
          },
        ],
      },
      { className: [cls.sidebar, cls.sidebarHidden] },
      { className: cls.gallery },
      { className: [cls.rightSidebar, cls.rightSidebarHidden] },
      { className: [cls.player, cls.playerHidden] },
    ],
  })
);

gallery.renderItems(items.getChildren("SEARCH"));
