"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const inversify_1 = require("inversify");
const pg = require("pg");
require("reflect-metadata");
const Guest_1 = require("../../../common/tables/Guest");
let DatabaseService = class DatabaseService {
    constructor() {
        // TODO: A MODIFIER POUR VOTRE BD
        this.connectionConfig = {
            user: "postgres",
            database: "postgres",
            password: "mysecretpassword",
            port: 5432,
            host: "127.0.0.1",
            keepAlive: true,
        };
        this.pool = new pg.Pool(this.connectionConfig);
    }
    // ======= DEBUG =======
    getAllFromTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const res = yield client.query(`SELECT * FROM HOTELDB.${tableName};`);
            client.release();
            return res;
        });
    }
    // ======= HOTEL =======
    createHotel(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!hotel.hotelnb || !hotel.name || !hotel.city)
                throw new Error("Invalid create hotel values");
            const values = [hotel.hotelnb, hotel.name, hotel.city];
            const queryText = `INSERT INTO HOTELDB.Hotel VALUES($1, $2, $3);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    // get hotels that correspond to certain caracteristics
    filterHotels(hotelNb, hotelName, city) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const searchTerms = [];
            if (hotelNb.length > 0)
                searchTerms.push(`hotelNb = '${hotelNb}'`);
            if (hotelName.length > 0)
                searchTerms.push(`name = '${hotelName}'`);
            if (city.length > 0)
                searchTerms.push(`city = '${city}'`);
            let queryText = "SELECT * FROM HOTELDB.Hotel";
            if (searchTerms.length > 0)
                queryText += " WHERE " + searchTerms.join(" AND ");
            queryText += ";";
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    // get the hotel names and numbers so so that the user can only select an existing hotel
    getHotelNamesByNos() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const res = yield client.query("SELECT hotelNb, name FROM HOTELDB.Hotel;");
            client.release();
            return res;
        });
    }
    // modify name or city of a hotel
    updateHotel(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            let toUpdateValues = [];
            if (hotel.name.length > 0)
                toUpdateValues.push(`name = '${hotel.name}'`);
            if (hotel.city.length > 0)
                toUpdateValues.push(`city = '${hotel.city}'`);
            if (!hotel.hotelnb ||
                hotel.hotelnb.length === 0 ||
                toUpdateValues.length === 0)
                throw new Error("Invalid hotel update query");
            const query = `UPDATE HOTELDB.Hotel SET ${toUpdateValues.join(", ")} WHERE hotelNb = '${hotel.hotelnb}';`;
            const res = yield client.query(query);
            client.release();
            return res;
        });
    }
    deleteHotel(hotelNb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hotelNb.length === 0)
                throw new Error("Invalid delete query");
            const client = yield this.pool.connect();
            const query = `DELETE FROM HOTELDB.Hotel WHERE hotelNb = '${hotelNb}';`;
            const res = yield client.query(query);
            client.release();
            return res;
        });
    }
    // ======= ROOMS =======
    createRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!room.roomnb || !room.hotelnb || !room.type || !room.price)
                throw new Error("Invalid create room values");
            const values = [
                room.roomnb,
                room.hotelnb,
                room.type,
                room.price.toString(),
            ];
            const queryText = `INSERT INTO HOTELDB.ROOM VALUES($1, $2, $3, $4);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    filterRooms(hotelNb, roomNb = "", roomType = "", price = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!hotelNb || hotelNb.length === 0)
                throw new Error("Invalid filterRooms request");
            let searchTerms = [];
            searchTerms.push(`hotelNb = '${hotelNb}'`);
            if (roomNb.length > 0)
                searchTerms.push(`hotelNb = '${hotelNb}'`);
            if (roomType.length > 0)
                searchTerms.push(`type = '${roomType}'`);
            if (price >= 0)
                searchTerms.push(`price = ${price}`);
            let queryText = `SELECT * FROM HOTELDB.Room WHERE ${searchTerms.join(" AND ")};`;
            const res = yield client.query(queryText);
            client.release();
            return res;
        });
    }
    updateRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            let toUpdateValues = [];
            if (room.price >= 0)
                toUpdateValues.push(`price = ${room.price}`);
            if (room.type.length > 0)
                toUpdateValues.push(`type = '${room.type}'`);
            if (!room.hotelnb ||
                room.hotelnb.length === 0 ||
                !room.roomnb ||
                room.roomnb.length === 0 ||
                toUpdateValues.length === 0)
                throw new Error("Invalid room update query");
            const query = `UPDATE HOTELDB.Room SET ${toUpdateValues.join(", ")} WHERE hotelNb = '${room.hotelnb}' AND roomNb = '${room.roomnb}';`;
            const res = yield client.query(query);
            client.release();
            return res;
        });
    }
    deleteRoom(hotelNb, roomNb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hotelNb.length === 0)
                throw new Error("Invalid room delete query");
            const client = yield this.pool.connect();
            const query = `DELETE FROM HOTELDB.Room WHERE hotelNb = '${hotelNb}' AND roomNb = '${roomNb}';`;
            const res = yield client.query(query);
            client.release();
            return res;
        });
    }
    // ======= GUEST =======
    createGuest(guest) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            if (!guest.guestnb ||
                !guest.nas ||
                !guest.name ||
                !guest.gender ||
                !guest.city)
                throw new Error("Invalid create room values");
            if (!(guest.gender in Guest_1.Gender))
                throw new Error("Unknown guest gender passed");
            const values = [
                guest.guestnb,
                guest.nas,
                guest.name,
                guest.gender,
                guest.city,
            ];
            const queryText = `INSERT INTO HOTELDB.Guest VALUES($1, $2, $3, $4, $5);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
    getGuests(hotelNb, roomNb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!hotelNb || hotelNb.length === 0)
                throw new Error("Invalid guest hotel no");
            const client = yield this.pool.connect();
            const queryExtension = roomNb ? ` AND b.roomNb = '${roomNb}'` : "";
            const query = `SELECT * FROM HOTELDB.Guest g JOIN HOTELDB.Booking b ON b.guestNb = g.guestNb WHERE b.hotelNb = '${hotelNb}'${queryExtension};`;
            const res = yield client.query(query);
            client.release();
            return res;
        });
    }
    // ======= BOOKING =======
    createBooking(hotelNb, guestNo, dateFrom, dateTo, roomNb) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const values = [
                hotelNb,
                guestNo,
                dateFrom.toString(),
                dateTo.toString(),
                roomNb,
            ];
            const queryText = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4,$5);`;
            const res = yield client.query(queryText, values);
            client.release();
            return res;
        });
    }
};
DatabaseService = __decorate([
    (0, inversify_1.injectable)()
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map