"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = exports.local = void 0;
const dgram_1 = __importDefault(require("dgram"));
const constants_json_1 = __importDefault(require("./constants.json"));
const client = dgram_1.default.createSocket("udp4");
exports.local = {
    state: "idle",
};
client.on("message", (msg, info) => {
    exports.local.state = msg.toString();
});
client.bind(constants_json_1.default.ports.response);
const bindStateManagement = (resolve, reject) => {
    let timeoutId = setTimeout(() => {
        exports.local.state = "error";
    }, 10000);
    let intervalId = setInterval(() => {
        if (isIdle())
            return;
        if (isError())
            reject(exports.local.state);
        else
            resolve(exports.local.state);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        exports.local.state = "idle";
    }, 100);
};
const isIdle = () => exports.local.state === "idle";
const isError = () => exports.local.state === "error";
const transmit = (command) => {
    const message = Buffer.from(command);
    client.send(message, 0, message.length, constants_json_1.default.ports.command, constants_json_1.default.hosts.remote, (error) => {
        if (error)
            exports.local.state = "error";
    });
};
const send = (command) => {
    return new Promise((resolve, reject) => {
        if (!isIdle())
            reject("error");
        bindStateManagement(resolve, reject);
        transmit(command);
    });
};
exports.send = send;
