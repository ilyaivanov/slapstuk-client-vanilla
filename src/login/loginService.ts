declare const firebase: any;

if (process.env.NODE_ENV === "test")
  throw new Error("Tried to initialize Firebase from tests");

export const authorize = () => firebaseAuth.signInWithPopup(provider);

export const logout = () => firebaseAuth.signOut();

var firebaseConfig = {
  apiKey: "AIzaSyBdqdXjle6-p2Mjp1TarQ8D8wKeJhXCfMs",
  authDomain: "slapstuk.firebaseapp.com",
  databaseURL: "https://slapstuk.firebaseio.com",
  projectId: "slapstuk",
  storageBucket: "slapstuk.appspot.com",
  messagingSenderId: "38999431091",
  appId: "1:38999431091:web:b8fd2629dfeabc96b39dc6",
  measurementId: "G-C3RB7NB0ZD",
};

firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export const saveUserSettings = (
  userSettings: PersistedState,
  userId: string
) => {
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set({
      id: userId,
      ...userSettings,
    })
    .catch((e: any) => {
      console.error("Error while saving user settings");
    });
};

export type PersistedState = {
  nodeFocused: string;
  itemsSerialized: string;
};

export const loadUserSettings = (userId: string): Promise<PersistedState> =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((res: any) => res.data() as PersistedState);

export const auth = () => {};

const api = {
  saveUserSettings,
  loadUserSettings,
  auth,
};
export default api;
