import * as stateStream from "./streams/state";
import * as videoStream from "./streams/video";

export const receiver = {
  state: stateStream,
  video: videoStream,
};

export * as control from "./commands/control";
export * as read from "./commands/read";
export * as set from "./commands/set";
