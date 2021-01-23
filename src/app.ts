import { cls, dom } from "./infra";
import * as sidebarController from "./sidebar/controller";
import * as galleryController from "./gallery/controller";
import * as playerController from "./player/controller";
import * as login from "./login/controller";
import "./app.style";
import { loadUserSettings, logout } from "./login/loginService";

export const init = () => {
  //check if logged in or subscribe to login status change
  login.addEventListener("login", initApp);
  login.addEventListener("logout", initLogin);
};

export const initLogin = () => login.init();

export const initApp = (userId: string) => {
  loadUserSettings(userId).then((data) => {
    sidebarController.setItems(
      JSON.parse(data.itemsSerialized),
      data.nodeFocused
    );

    const root = dom.findById("root");
    root.innerHTML = "";
    root.appendChild(
      dom.div({
        className: cls.page,
        children: [
          {
            className: cls.header,
            children: {
              type: "button",
              children: "logout",
              on: { click: logout },
            },
          },
          { className: cls.sidebar },
          { className: cls.gallery },
          { className: cls.player },
        ],
      })
    );

    sidebarController.init(dom.findFirstByClass(cls.sidebar));
    playerController.init();
    galleryController.renderItems(
      sidebarController.items["HOME"].children.map(
        (id) => sidebarController.items[id]
      )
    );
  });
};

document.addEventListener;
