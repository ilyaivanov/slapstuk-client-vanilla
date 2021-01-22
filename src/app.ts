import { cls, dom } from "./infra";
import * as sidebarController from "./sidebar/controller";
import * as galleryController from "./gallery/controller";
// import * as playground from "./playground/collapsingItems";
// import * as playground from "./playground/iconTransition";

export const init = () => {
  const root = dom.findById("root");

  // playground.init(root);

  root.appendChild(
    dom.div({
      className: cls.page,
      children: [
        { className: cls.header },
        { className: cls.sidebar },
        { className: cls.gallery },
      ],
    })
  );

  sidebarController.init(dom.findFirstByClass(cls.sidebar));
  galleryController.renderItems(
    sidebarController.items["FLhAjBdk"].children.map(
      (id) => sidebarController.items[id]
    )
  );
};
