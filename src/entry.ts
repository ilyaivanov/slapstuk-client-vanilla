import "./app.style";
//comment out other code below to properly render playground
//this will render the whole app in ready state
// import "./playgrounds/galleryWithDifferentCards";

import * as app from "./app";
import * as api from "./api/controller";

api.addEventListener("login", app.initApp);
api.addEventListener("logout", app.initLogin);

api.init();
app.init();
