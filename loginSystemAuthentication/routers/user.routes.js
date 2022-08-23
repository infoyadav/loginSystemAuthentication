const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user.Controllers.js");

const auth = require("../middleware/auth.middleware.js");

// here we use a route-level middleware - To protect the routes.
router.use("/changePassword", auth);
router.use("/loggedUser", auth);

// public routers
router.get("/", userControllers.defaultController);
router.post("/createUser", userControllers.createUser);
router.get("/getUsers", userControllers.getUsers);
router.post("/login", userControllers.userlogin);
router.post("/resetPassword", userControllers.sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token", userControllers.userPasswordReset)

// protected routers
router.post("/changePassword", userControllers.changePassword)
router.get("/loggedUser", userControllers.loggedUser);

module.exports = router;