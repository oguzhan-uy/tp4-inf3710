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
exports.DatabaseController = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const database_service_1 = require("../services/database.service");
const types_1 = require("../types");
let DatabaseController = class DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    get router() {
        const router = (0, express_1.Router)();
        // ======= HOTEL ROUTES =======
        // ex http://localhost:3000/database/hotel?hotelNb=3&name=LeGrandHotel&city=laval
        router.get("/hotels", (req, res, _) => {
            var hotelNb = req.params.hotelNb ? req.params.hotelNb : "";
            var hotelName = req.params.name ? req.params.name : "";
            var hotelCity = req.params.city ? req.params.city : "";
            this.databaseService
                .filterHotels(hotelNb, hotelName, hotelCity)
                .then((result) => {
                const hotels = result.rows.map((hotel) => ({
                    hotelnb: hotel.hotelnb,
                    name: hotel.name,
                    city: hotel.city,
                }));
                res.json(hotels);
            })
                .catch((e) => {
                console.error(e.stack);
            });
        });
        router.get("/hotels/hotelNb", (req, res, _) => {
            this.databaseService
                .getHotelNamesByNos()
                .then((result) => {
                const hotelsNbsNames = result.rows.map((hotel) => ({
                    hotelnb: hotel.hotelnb,
                    name: hotel.name,
                }));
                res.json(hotelsNbsNames);
            })
                .catch((e) => {
                console.error(e.stack);
            });
        });
        router.post("/hotels/insert", (req, res, _) => {
            const hotel = {
                hotelnb: req.body.hotelnb,
                name: req.body.name,
                city: req.body.city,
            };
            this.databaseService
                .createHotel(hotel)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
                res.json(-1);
            });
        });
        router.post("/hotels/delete/:hotelNb", (req, res, _) => {
            const hotelNb = req.params.hotelNb;
            this.databaseService
                .deleteHotel(hotelNb)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
            });
        });
        router.put("/hotels/update", (req, res, _) => {
            const hotel = {
                hotelnb: req.body.hotelnb,
                name: req.body.name ? req.body.name : "",
                city: req.body.city ? req.body.city : "",
            };
            this.databaseService
                .updateHotel(hotel)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
            });
        });
        // ======= ROOMS ROUTES =======
        router.get("/rooms", (req, res, _) => {
            const hotelNb = req.query.hotelNb ? req.query.hotelNb : "";
            const roomNb = req.query.roomNb ? req.query.roomNb : "";
            const roomType = req.query.type ? req.query.type : "";
            const roomPrice = req.query.price
                ? parseFloat(req.query.price)
                : -1;
            this.databaseService
                .filterRooms(hotelNb, roomNb, roomType, roomPrice)
                .then((result) => {
                const rooms = result.rows.map((room) => ({
                    hotelnb: room.hotelnb,
                    roomnb: room.roomnb,
                    type: room.type,
                    price: parseFloat(room.price.toString()),
                }));
                res.json(rooms);
            })
                .catch((e) => {
                console.error(e.stack);
            });
        });
        router.post("/rooms/insert", (req, res, _) => {
            const room = {
                hotelnb: req.body.hotelnb,
                roomnb: req.body.roomnb,
                type: req.body.type,
                price: parseFloat(req.body.price),
            };
            this.databaseService
                .createRoom(room)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
                res.json(-1);
            });
        });
        router.put("/rooms/update", (req, res, _) => {
            const room = {
                hotelnb: req.body.hotelnb,
                roomnb: req.body.roomnb,
                type: req.body.type,
                price: parseFloat(req.body.price),
            };
            this.databaseService
                .updateRoom(room)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
                res.json(-1);
            });
        });
        router.post("/rooms/delete/:hotelNb/:roomNb", (req, res, _) => {
            const hotelNb = req.params.hotelNb;
            const roomNb = req.params.roomNb;
            this.databaseService
                .deleteRoom(hotelNb, roomNb)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
                res.json(-1);
            });
        });
        // ======= GUEST ROUTES =======
        router.post("/guests/insert", (req, res, _) => {
            const guest = {
                guestnb: req.body.guestnb,
                nas: req.body.nas,
                name: req.body.name,
                gender: req.body.gender,
                city: req.body.city,
            };
            this.databaseService
                .createGuest(guest)
                .then((result) => {
                res.json(result.rowCount);
            })
                .catch((e) => {
                console.error(e.stack);
                res.json(-1);
            });
        });
        router.get("/guests/:hotelNb/:roomNb", (req, res, _) => {
            const hotelNb = req.params.hotelNb;
            const roomNb = req.params.roomNb;
            this.databaseService
                .getGuests(hotelNb, roomNb)
                .then((result) => {
                const guests = result.rows.map((guest) => ({
                    guestnb: guest.guestnb,
                    nas: guest.nas,
                    name: guest.name,
                    gender: guest.gender,
                    city: guest.city,
                }));
                res.json(guests);
            })
                .catch((e) => {
                console.error(e.stack);
                res.json(-1);
            });
        });
        // ======= GENERAL ROUTES =======
        router.get("/tables/:tableName", (req, res, next) => {
            this.databaseService
                .getAllFromTable(req.params.tableName)
                .then((result) => {
                res.json(result.rows);
            })
                .catch((e) => {
                console.error(e.stack);
            });
        });
        return router;
    }
};
DatabaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DatabaseService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
exports.DatabaseController = DatabaseController;
//# sourceMappingURL=database.controller.js.map