import dgram from "dgram";
import constants from "../constants.json";
import EventEmitter from "events";

const client = dgram.createSocket("udp4");
const local: {
  emitter: EventEmitter | undefined;
} = {
  emitter: undefined,
};

interface Mapped {
  pitch: number;
  roll: number;
  yaw: number;
  vgx: number;
  vgy: number;
  vgz: number;
  templ: number;
  temph: number;
  tof: number;
  h: number;
  bat: number;
  baro: number;
  time: number;
  agx: number;
  agy: number;
  agz: number;
}

const format = (mapped: Mapped) => ({
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

const map = (message: Buffer) => {
  let mapped = message
    .toString()
    .slice(0, -1)
    .split(";")
    .map((element) => element.split(":"))
    .reduce(
      (
        acc: {
          [key: string]: number;
        },
        [key, value]
      ) => {
        acc[key] = Number(value);
        return acc;
      },
      {}
    );

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
client.on("message", (message) => local.emitter?.emit("message", map(message)));

export const bind = () => {
  client.bind(constants.ports.state);
  local.emitter = new EventEmitter();
  return local.emitter;
};

export const close = () => client.close();

module.exports = { bind, close };
