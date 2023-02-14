import { send } from "../exchanger";

export const speed = () => send("speed?");

export const battery = () => send("battery?");

export const time = () => send("time?");

export const height = () => send("height?");

export const temperature = () => send("temp?");

export const attitude = () => send("attitude?");

export const barometer = () => send("baro?");

export const acceleration = () => send("acceleration?");

export const tof = () => send("tof?");

export const wifi = () => send("wifi?");
