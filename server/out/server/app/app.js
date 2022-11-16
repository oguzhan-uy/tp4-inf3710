"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const inversify_1 = require("inversify");
const logger = require("morgan");
const database_controller_1 = require("./controllers/database.controller");
const types_1 = require("./types");
let Application = class Application {
    constructor(databaseController) {
        this.databaseController = databaseController;
        this.internalError = 500;
        this.app = express();
        this.config();
        this.bindRoutes();
    }
    config() {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }
    bindRoutes() {
        // Notre application utilise le routeur de notre API
        this.app.use("/database", this.databaseController.router);
        this.errorHandeling();
    }
    errorHandeling() {
        // Gestion des erreurs
        this.app.use((req, res, next) => {
            const err = new Error("Not Found");
            err.status = 404;
            next(err);
        });
        // development error handler
        // will print stacktrace
        // if (this.app.get("env") === "development") {
        // if(true){
        // tslint:disable-next-line:no-any
        this.app.use((err, req, res, next) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: err,
            });
        });
        // }
        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        // this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        //     res.status(err.status || this.internalError);
        //     res.send({
        //         message: err.message,
        //         error: {},
        //     });
        // });
    }
};
Application = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DatabaseController)),
    __metadata("design:paramtypes", [database_controller_1.DatabaseController])
], Application);
exports.Application = Application;
//# sourceMappingURL=app.js.map