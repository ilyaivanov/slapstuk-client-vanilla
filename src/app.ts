import { cls, dom, ids } from "./infra";
import * as sidebarController from "./sidebar/controller";
import * as galleryController from "./gallery/controller";
import * as searchController from "./search/controller";
import * as player from "./player/controller";
import * as login from "./login/controller";
import "./app.style";
import { loadUserSettings, logout } from "./login/loginService";
import * as items from "./items";

export const init = () => {
  //check if logged in or subscribe to login status change
  login.addEventListener("login", initApp);
  login.addEventListener("logout", initLogin);

  const a = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16">

  <circle cx="8" cy="8" r="5" fill="white"></circle>
  
</svg>`;
  dom
    .findById("favicon")
    .setAttribute("href", "data:image/svg+xml," + encodeURIComponent(a));
};

export const initLogin = () => login.init();

export const initApp = (userId: string) => {
  loadUserSettings(userId).then((data) => {
    if (data) {
      const selectedItemId = data.nodeFocused;
      items.setItems(JSON.parse(data.itemsSerialized));
      items.setSelectedItem(selectedItemId || "HOME");
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
                children: "toggle sidebar",
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
                on: { click: searchController.search },
                children: "go",
              },
              {
                type: "button",
                style: {
                  marginLeft: "800px",
                },
                children: "logout",
                on: { click: logout },
              },
            ],
          },
          { className: cls.sidebar },
          { className: cls.gallery },
          { className: cls.player },
        ],
      })
    );

    sidebarController.init(dom.findFirstByClass(cls.sidebar));
    player.init();

    galleryController.renderItems(items.getChildren(items.selectedItemId));
  });
};

document.addEventListener;
