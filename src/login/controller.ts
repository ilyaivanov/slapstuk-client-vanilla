import { cls, dom } from "../infra";
import { authorize, firebaseAuth } from "./loginService";
import "./style";

export const init = () => {
  console.log("Init login");
  const loginPage = dom.div({
    className: cls.loginContainer,
    children: {
      className: cls.loginForm,
      children: [
        {
          type: "img",
          attributes: {
            src:
              "data:image/png;base64,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",
          },
        },
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
type EventType = "login" | "logout";

//TODO: consider extracting events to a separate file
//making a nice generic type expencting EventMap
//check document.addEventListener as an example
type Callback<T> = (val: T) => void;

const listeners = {
  login: [] as Callback<any>[],
  logout: [] as Callback<any>[],
} as const;

export const addEventListener = (event: EventType, callback: Callback<any>) => {
  listeners[event].push(callback);
};

export const removeEventListener = (
  event: EventType,
  callback: Callback<any>
) => {
  listeners[event].slice(listeners[event].indexOf(callback), 1);
};

const notifyListeners = (event: EventType, args: any) => {
  listeners[event].forEach((callback) => callback(args));
};

export const onLoginClick = () => {
  const button = dom.findFirstByClass<HTMLButtonElement>(cls.loginButton);
  button.disabled = true;

  authorize()
    .then((e: any) => {
      button.disabled = false;
      notifyListeners("login", e.user.uid);
    })
    .catch((error: any) => {
      console.error(error);
      button.disabled = false;
    });
};

firebaseAuth.onAuthStateChanged(function (user: any) {
  if (user) notifyListeners("login", user.uid);
  //   actions.setUserState({
  //     state: "userLoggedIn",
  //     userId: user.uid,
  //     userName: user.displayName,
  //     picture: user.photoURL,
  //     email: user.email || "",
  //   });
  else {
    notifyListeners("logout", undefined);
    //   actions.setUserState({
    //     state: "anonymous",
    //   });
  }
});
