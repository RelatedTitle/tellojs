jest.mock("../build/commands/control", () => jest.fn());
jest.mock("../build/commands/read", () => jest.fn());
jest.mock("../build/commands/set", () => jest.fn());
jest.mock("../build/streams/state", () => jest.fn());
jest.mock("../build/streams/video", () => jest.fn());

const controlCommands = require("../build/commands/control"),
  readCommands = require("../build/commands/read"),
  setCommands = require("../build/commands/set"),
  stateStream = require("../build/streams/state"),
  videoStream = require("../build/streams/video"),
  index = require("../build/index");

describe("index", () => {
  it("should export read commands", () => {
    expect(index.read.default).toBe(readCommands);
  });

  it("should export control commands", () => {
    expect(index.control.default).toBe(controlCommands);
  });

  it("should export control commands", () => {
    expect(index.set.default).toBe(setCommands);
  });

  it("should export state stream", () => {
    expect(index.receiver.state.default).toBe(stateStream);
  });

  it("should export video stream", () => {
    expect(index.receiver.video.default).toBe(videoStream);
  });
});
