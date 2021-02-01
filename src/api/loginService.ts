declare const firebase: any;

export const authorize = () =>
  firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

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
let firebaseAuth: ReturnType<typeof firebase.auth>;
export const initFirebase = (onAuthChanged: any) => {
  firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
  firebaseAuth.onAuthStateChanged(onAuthChanged);
};

export const saveUserSettings = (
  userSettings: PersistedState,
  userId: string
): Promise<any> =>
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

export type PersistedState = {
  selectedItemId: string;
  focusedItemId: string;
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
