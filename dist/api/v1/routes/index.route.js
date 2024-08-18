"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_route_1 = require("./task.route");
var user_route_1 = require("./user.route");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var v1Route = function (app) {
    var version = "/api/v1";
    app.use(version + "/tasks", auth_middleware_1.requireAuth, task_route_1.taskRoutes);
    app.use(version + "/users", user_route_1.userRoutes);
};
exports.default = v1Route;
