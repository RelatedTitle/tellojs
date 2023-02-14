"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.bind = void 0;
const dgram_1 = __importDefault(require("dgram"));
const constants_json_1 = __importDefault(require("../constants.json"));
const events_1 = __importDefault(require("events"));
const client = dgram_1.default.createSocket("udp4");
const local = {
    emitter: undefined,
};
const format = (mapped) => ({
    pitch: mapped.pitch,
    roll: mapped.roll,
    yaw: mapped.yaw,
    speed: { x: mapped.vgx, y: mapped.vgy, z: mapped.vgz },
    temperature: { low: mapped.templ, high: mapped.temph },
    tof: mapped.tof,
    heigh: mapped.h,
    battery: mapped.bat,
    barometer: mapped.baro,
    time: mapped.time,
    acceleration: { x: mapped.agx, y: mapped.agy, z: mapped.agz },
});
const map = (message) => {
    let mapped = message
        .toString()
        .slice(0, -1)
        .split(";")
        .map((element) => element.split(":"))
        .reduce((acc, [key, value]) => {
        acc[key] = Number(value);
        return acc;
    }, {});
    return format({
        pitch: mapped["pitch"],
        roll: mapped["roll"],
        yaw: mapped["yaw"],
        vgx: mapped["vgx"],
        vgy: mapped["vgy"],
        vgz: mapped["vgz"],
        templ: mapped["templ"],
        temph: mapped["temph"],
        tof: mapped["tof"],
        h: mapped["h"],
        bat: mapped["bat"],
        baro: mapped["baro"],
        time: mapped["time"],
        agx: mapped["agx"],
        agy: mapped["agy"],
        agz: mapped["agz"],
    });
};
client.on("message", (message) => { var _a; return (_a = local.emitter) === null || _a === void 0 ? void 0 : _a.emit("message", map(message)); });
const bind = () => {
    client.bind(constants_json_1.default.ports.state);
    local.emitter = new events_1.default();
    return local.emitter;
};
exports.bind = bind;
const close = () => client.close();
exports.close = close;
module.exports = { bind: exports.bind, close: exports.close };
