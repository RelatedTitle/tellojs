"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.bind = void 0;
const dgram_1 = __importDefault(require("dgram"));
const constants_json_1 = __importDefault(require("../constants.json"));
const exchanger_1 = require("../exchanger");
const events_1 = __importDefault(require("events"));
const client = dgram_1.default.createSocket("udp4");
const local = {
    emitter: undefined,
};
client.on("message", (message) => { var _a; return (_a = local.emitter) === null || _a === void 0 ? void 0 : _a.emit("message", message); });
const bind = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exchanger_1.send)("streamon");
    }
    catch (_) {
        throw "Unable to start video stream";
    }
    client.bind(constants_json_1.default.ports.video);
    local.emitter = new events_1.default();
    return local.emitter;
});
exports.bind = bind;
const close = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exchanger_1.send)("streamoff");
    }
    catch (error) {
        throw "Unable to stop video stream";
    }
    client.close();
});
exports.close = close;
