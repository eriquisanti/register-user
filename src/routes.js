const { Router } = require('express');
const userControllers = require('./app/controllers/User')
const adminControllers = require('./app/controllers/Admin')

const routes = new Router();
/**APIs */
/**Users */
routes.post("/register/user", userControllers.postUser);
routes.get("/search/user", userControllers.getUser);

/**Admins */
routes.post("/register/admin", adminControllers.postAdmin);

/** Front - end */
routes.post("/login/admin", adminControllers.postLogin);
routes.get("/login", adminControllers.getLogin);

routes.get("/admin/painel", adminControllers.getPainel);
routes.post("/logout", adminControllers.logout);
// routes.get("/login", adminControllers.login);

routes.post("/get/admin", adminControllers.getNameAdmin);

module.exports = routes;