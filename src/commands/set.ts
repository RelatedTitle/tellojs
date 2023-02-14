import { send } from "../exchanger";

export const speed = (speed: number) => send(`speed ${speed}`);

export const rc = (x: number, y: number, z: number, yaw: number) =>
  send(`rc ${x} ${y} ${z} ${yaw}`);

export const wifi = (ssid: string, password: string) =>
  send(`wifi ${ssid} ${password}`);
