import * as app from "./app";
import * as api from "./api/controller";
import "./app.style";

api.addEventListener("login", app.initApp);
api.addEventListener("logout", app.initLogin);

api.init();
app.init();

//comment out other init code, this will render the whole app in ready state
// import './playgrounds/galleryWithDifferentCards';
