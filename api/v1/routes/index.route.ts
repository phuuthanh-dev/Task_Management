import { Express } from "express";
import { taskRoutes } from "./task.route";
import { userRoutes } from "./user.route";
import { requireAuth } from "../middlewares/auth.middleware";

const v1Route = (app: Express): void => {
    const version = "/api/v1";

    app.use(version + "/tasks", requireAuth, taskRoutes);

    app.use(version + "/users", userRoutes);
}

export default v1Route;