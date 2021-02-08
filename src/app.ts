import { cls, dom, ids, isIsolated, styles } from "./infra";
import * as sidebarController from "./sidebar/controller";
import * as gallery from "./gallery1/gallery";
import * as searchController from "./search/controller";
import * as player from "./player/controller";
import * as login from "./login/controller";
import "./app.style";
import * as api from "./api/controller";
import * as items from "./items";

export const init = () => {
  dom.findById("root").appendChild(
    dom.div({
      className: cls.loadGridContainer,
      children: {
        className: cls.loadGrid,
        children: Array.from(new Array(9)).map(() => ({})),
      },
    })
  );
  const color = isIsolated ? "#ba68c8" : "white";
  const a = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16">

  <circle cx="8" cy="8" r="5" fill="${color}"></circle>

</svg>`;
  dom
    .findById("favicon")
    .setAttribute("href", "data:image/svg+xml," + encodeURIComponent(a));
};

export const initLogin = () => login.init();

//temp UI options model
let leftSidebarWidth = 0;
export const setLeftSidebarWidth = (width: number) => {
  leftSidebarWidth = width;
  styles.setLeftSidebarWidth(width);
  gallery.rerenderIfColumnsChanged();
};
export const initApp = (userId: string) => {
  api.loadUserSettings(userId).then((data) => {
    if (data) {
      //@ts-ignore
      global.allItems = JSON.parse(data.itemsSerialized);
      items.setItems(JSON.parse(data.itemsSerialized));
      items.setSelectedItem(data.selectedItemId);
      // items.setFocusStack(data.focusedStack);

      leftSidebarWidth = data.ui?.leftSidebarWidth || 300;
      styles.setLeftSidebarWidth(leftSidebarWidth);
      styles.setRightSidebarWidth(300);
    }
    const root = dom.findById("root");
    root.innerHTML = "";
    root.appendChild(
      dom.div({
        className: cls.page,
        children: [
          {
            className: cls.header,
            children: [
              {
                type: "button",
                on: { click: player.playNext },
                children: "next",
              },
              {
                type: "button",
                on: { click: sidebarController.toggleLeftSidebar },
                children: "left sidebar",
              },
              {
                type: "button",
                on: { click: sidebarController.togleRightSidebar },
                children: "right sidebar",
              },
              {
                type: "button",
                on: { click: player.toggleYoutubePlayerVisibility },
                children: "toggle player",
              },
              {
                type: "input",
                id: ids.searchInput,
                attributes: {
                  placeholder: "Search for anything",
                },
              },
              {
                type: "button",
                on: { click: searchController.search },
                children: "go",
              },
              {
                type: "button",
                on: {
                  click: () => {
                    api.saveUserSettings(userId, {
                      itemsSerialized: JSON.stringify(items.allItems),
                      selectedItemId: items.selectedItemId,
                      focusedStack: items.focusStack,
                      ui: { leftSidebarWidth },
                    });
                  },
                },
                children: "save",
              },
              {
                type: "button",
                style: {
                  marginLeft: "800px",
                },
                children: "logout",
                on: { click: api.logout },
              },
            ],
          },
          {
            className: cls.sidebar,
          },
          { className: [cls.rightSidebar, cls.rightSidebarHidden] },
          {
            className: cls.gallery,
          },
          { className: [cls.player, cls.playerHidden] },
        ],
      })
    );

    sidebarController.init(dom.findFirstByClass(cls.sidebar));

    gallery.renderItems(items.getChildren(items.selectedItemId));
  });
};
