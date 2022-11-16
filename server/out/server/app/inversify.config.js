"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const app_1 = require("./app");
const database_controller_1 = require("./controllers/database.controller");
const server_1 = require("./server");
const database_service_1 = require("./services/database.service");
const types_1 = require("./types");
const container = new inversify_1.Container();
exports.container = container;
container.bind(types_1.default.Server).to(server_1.Server);
container.bind(types_1.default.Application).to(app_1.Application);
container.bind(types_1.default.DatabaseService).to(database_service_1.DatabaseService).inSingletonScope();
container.bind(types_1.default.DatabaseController).to(database_controller_1.DatabaseController);
//# sourceMappingURL=inversify.config.js.map