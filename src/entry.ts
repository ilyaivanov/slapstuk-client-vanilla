import * as app from "./app";
import * as api from "./api/controller";

api.addEventListener("login", app.initApp);
api.addEventListener("logout", app.initLogin);

api.init();
app.init();
