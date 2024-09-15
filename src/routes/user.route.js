import userController from "../controllers/user.controllers.js";
route.post("/", userController.create);

export default UserRoutes;