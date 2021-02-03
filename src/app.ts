import { cls, dom, ids, isIsolated } from "./infra";
import * as sidebarController from "./sidebar/controller";
// import * as galleryController from "./gallery/controller";
// import * as searchController from "./search/controller";
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

export const initApp = (userId: string) => {
  api.loadUserSettings(userId).then((data) => {
    if (data) {
      //@ts-ignore
      global.allItems = JSON.parse(data.itemsSerialized);
      items.setItems(JSON.parse(data.itemsSerialized));
      items.setSelectedItem(data.selectedItemId);
      items.setFocusedItem(data.focusedItemId);
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
                on: { click: sidebarController.toggleVisibility },
                children: "left sidebar",
              },
              {
                type: "button",
                on: { click: sidebarController.togleRightSidebar },
                children: "right sidebar",
              },
              {
                type: "button",
                on: { click: player.toggleVisibility },
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
                // on: { click: searchController.search },
                children: "go",
              },
              {
                type: "button",
                on: {
                  click: () => {
                    api.saveUserSettings(userId, {
                      itemsSerialized: JSON.stringify(items.allItems),
                      selectedItemId: items.selectedItemId,
                      focusedItemId: items.focusedItemId,
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
          { className: cls.sidebar },
          { className: [cls.rightSidebar, cls.rightSidebarHidden] },
          { className: cls.gallery },
          { className: cls.player },
        ],
      })
    );

    sidebarController.init(dom.findFirstByClass(cls.sidebar));
    player.init();

    // galleryController.renderItems(items.getChildren(items.selectedItemId));
  });
};
