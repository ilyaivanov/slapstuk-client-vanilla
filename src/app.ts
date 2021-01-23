import { cls, dom } from "./infra";
import * as sidebarController from "./sidebar/controller";
import * as galleryController from "./gallery/controller";
import * as playerController from "./player/controller";
import * as login from "./login/controller";
import "./app.style";

export const init = () => {
  //check if logged in or subscribe to login status change
  login.addEventListener("login", initApp);
  login.init();
};

export const initApp = () => {
  const root = dom.findById("root");
  root.innerHTML = "";
  root.appendChild(
    dom.div({
      className: cls.page,
      children: [
        { className: cls.header },
        { className: cls.sidebar },
        { className: cls.gallery },
        { className: cls.player },
      ],
    })
  );

  sidebarController.init(dom.findFirstByClass(cls.sidebar));
  playerController.init();
  galleryController.renderItems(
    sidebarController.items["FLhAjBdk"].children.map(
      (id) => sidebarController.items[id]
    )
  );
};
