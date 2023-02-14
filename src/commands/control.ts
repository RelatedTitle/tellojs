import { send } from "../exchanger";

interface Curve {
  x: number;
  y: number;
  z: number;
}

export const connect = () => send("command");

export const takeOff = () => send("takeoff");

export const land = () => send("land");

export const emergency = () => send("emergency");

export const stop = () => send("stop");

export const flipCommand = (side: "l" | "r" | "b" | "f") =>
  send(`flip ${side}`);

export const flip = {
  left: () => flipCommand("l"),
  right: () => flipCommand("r"),
  back: () => flipCommand("b"),
  front: () => flipCommand("f"),
};

const up = (distance: number) => send(`up ${distance}`);

const down = (distance: number) => send(`down ${distance}`);

const left = (distance: number) => send(`left ${distance}`);

const right = (distance: number) => send(`right ${distance}`);

const front = (distance: number) => send(`forward ${distance}`);

const back = (distance: number) => send(`back ${distance}`);

export const move = {
  up,
  down,
  left,
  right,
  back,
  front,
};

export const clockwise = (angle: number) => send(`cw ${angle}`);

export const counterClockwise = (angle: number) => send(`ccw ${angle}`);

export const rotate = {
  clockwise,
  counterClockwise,
};

export const go = (end: Curve, speed: number) =>
  send(`go ${end.x} ${end.y} ${end.z} ${speed}`);

export const curve = (start: Curve, end: Curve, speed: number) =>
  send(
    `curve ${start.x} ${start.y} ${start.z} ${end.x} ${end.y} ${end.z} ${speed}`
  );
