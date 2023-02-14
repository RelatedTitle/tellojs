import dgram from "dgram";
import constants from "./constants.json";

const client = dgram.createSocket("udp4");
export const local = {
  state: "idle",
};

client.on("message", (msg, info) => {
  local.state = msg.toString();
});

client.bind(constants.ports.response);

const bindStateManagement = (
  resolve: (value: string) => void,
  reject: (reason: string) => void
) => {
  let timeoutId = setTimeout(() => {
    local.state = "error";
  }, 10000);
  let intervalId = setInterval(() => {
    if (isIdle()) return;
    if (isError()) reject(local.state);
    else resolve(local.state);
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    local.state = "idle";
  }, 100);
};

const isIdle = () => local.state === "idle";
const isError = () => local.state === "error";

const transmit = (command: string) => {
  const message = Buffer.from(command);
  client.send(
    message,
    0,
    message.length,
    constants.ports.command,
    constants.hosts.remote,
    (error) => {
      if (error) local.state = "error";
    }
  );
};

export const send = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isIdle()) reject("error");
    bindStateManagement(resolve, reject);
    transmit(command);
  });
};
