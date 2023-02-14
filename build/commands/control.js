"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curve = exports.go = exports.rotate = exports.counterClockwise = exports.clockwise = exports.move = exports.flip = exports.flipCommand = exports.stop = exports.emergency = exports.land = exports.takeOff = exports.connect = void 0;
const exchanger_1 = require("../exchanger");
const connect = () => (0, exchanger_1.send)("command");
exports.connect = connect;
const takeOff = () => (0, exchanger_1.send)("takeoff");
exports.takeOff = takeOff;
const land = () => (0, exchanger_1.send)("land");
exports.land = land;
const emergency = () => (0, exchanger_1.send)("emergency");
exports.emergency = emergency;
const stop = () => (0, exchanger_1.send)("stop");
exports.stop = stop;
const flipCommand = (side) => (0, exchanger_1.send)(`flip ${side}`);
exports.flipCommand = flipCommand;
exports.flip = {
    left: () => (0, exports.flipCommand)("l"),
    right: () => (0, exports.flipCommand)("r"),
    back: () => (0, exports.flipCommand)("b"),
    front: () => (0, exports.flipCommand)("f"),
};
const up = (distance) => (0, exchanger_1.send)(`up ${distance}`);
const down = (distance) => (0, exchanger_1.send)(`down ${distance}`);
const left = (distance) => (0, exchanger_1.send)(`left ${distance}`);
const right = (distance) => (0, exchanger_1.send)(`right ${distance}`);
const front = (distance) => (0, exchanger_1.send)(`forward ${distance}`);
const back = (distance) => (0, exchanger_1.send)(`back ${distance}`);
exports.move = {
    up,
    down,
    left,
    right,
    back,
    front,
};
const clockwise = (angle) => (0, exchanger_1.send)(`cw ${angle}`);
exports.clockwise = clockwise;
const counterClockwise = (angle) => (0, exchanger_1.send)(`ccw ${angle}`);
exports.counterClockwise = counterClockwise;
exports.rotate = {
    clockwise: exports.clockwise,
    counterClockwise: exports.counterClockwise,
};
const go = (end, speed) => (0, exchanger_1.send)(`go ${end.x} ${end.y} ${end.z} ${speed}`);
exports.go = go;
const curve = (start, end, speed) => (0, exchanger_1.send)(`curve ${start.x} ${start.y} ${start.z} ${end.x} ${end.y} ${end.z} ${speed}`);
exports.curve = curve;
