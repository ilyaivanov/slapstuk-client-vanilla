import { isIsolated } from "../infra";
import * as firebase from "./loginService";

export const init = () => {
  if (isIsolated) {
    console.log("Initiating an isolated mode");
    setTimeout(() => {
      onAuthStateChanged({ uid: "SAMPLE_USER_ID" });
    });
  } else {
    firebase.initFirebase(onAuthStateChanged);
  }
};

export const login = (): Promise<any> => {
  if (isIsolated) {
    onAuthStateChanged({ uid: "SAMPLE_USER_ID" });
    return Promise.resolve();
  } else {
    return firebase.authorize();
  }
};

export const logout = () => {
  if (isIsolated) {
    notifyListeners("logout", undefined);
  } else {
    firebase.logout();
  }
};

export const loadUserSettings = (
  userId: string
): Promise<firebase.PersistedState> => {
  if (isIsolated) {
    const items: Items = {
      HOME: {
        id: "HOME",
        title: "HOME",
        type: "folder",
        children: ["1", "2"],
      },
      1: {
        id: "1",
        title: "First Item",
        type: "folder",
        children: [],
      },
      2: {
        id: "2",
        title: "Second Item",
        type: "folder",
        children: [],
      },
    };
    return Promise.resolve({
      itemsSerialized: JSON.stringify(items),
      focusedItemId: "HOME",
      selectedItemId: "HOME",
    });
  } else {
    return firebase.loadUserSettings(userId);
  }
};

export const saveUserSettings = (
  userId: string,
  state: firebase.PersistedState
): Promise<any> => {
  if (isIsolated) return Promise.resolve();
  return firebase.saveUserSettings(state, userId);
};

const onAuthStateChanged = (user: any) => {
  if (user) notifyListeners("login", user.uid);
  else notifyListeners("logout", undefined);
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
