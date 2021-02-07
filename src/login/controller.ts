import { cls, dom } from "../infra";
import * as api from "../api/controller";
import "./style";
export const init = () => {
  const loginPage = dom.div({
    className: cls.loginContainer,
    children: {
      className: cls.loginForm,
      children: [
        {
          className: cls.loginButton,
          on: { click: onLoginClick },
          type: "button",
          children: [
            { type: "img" },
            { children: "sign in with Google", type: "span" },
          ],
        },
        {
          type: "span",
          children: "You will be registered automagically if needed",
        },
      ],
    },
  });
  const root = dom.findById("root");
  root.innerHTML = "";
  root.appendChild(loginPage);
};

export const onLoginClick = () => {
  const button = dom.findFirstByClass<HTMLButtonElement>(cls.loginButton);
  button.disabled = true;

  api
    .login()
    .then((e: any) => {
      button.disabled = false;
      // notifyListeners("login", e.user.uid);
    })
    .catch((error: any) => {
      console.error(error);
      button.disabled = false;
    });
};
