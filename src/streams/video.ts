import dgram from "dgram";
import constants from "../constants.json";
import { send } from "../exchanger";
import EventEmitter from "events";

const client = dgram.createSocket("udp4");
const local: {
  emitter: EventEmitter | undefined;
} = {
  emitter: undefined,
};

client.on("message", (message) => local.emitter?.emit("message", message));

export const bind = async (): Promise<EventEmitter> => {
  try {
    await send("streamon");
  } catch (_) {
    throw "Unable to start video stream";
  }
  client.bind(constants.ports.video);
  local.emitter = new EventEmitter();
  return local.emitter;
};

export const close = async () => {
  try {
    await send("streamoff");
  } catch (error) {
    throw "Unable to stop video stream";
  }
  client.close();
};
