import { cls, dom } from "./infra";
import * as sidebarController from "./sidebar/controller";
// import * as playground from "./playground/collapsingItems";
// import * as playground from "./playground/iconTransition";

export const init = () => {
  const root = dom.findById("root");

  // playground.init(root);

  root.appendChild(
    dom.div({
      className: cls.page,
      children: [{ className: cls.header }, { className: cls.sidebar }],
    })
  );
  sidebarController.init(dom.findFirstByClass(cls.sidebar));
};
