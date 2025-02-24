jest.useFakeTimers();
jest.spyOn(global, "clearInterval");
jest.spyOn(global, "clearTimeout");
const EventEmitter = require("events");
class TestEmitter extends EventEmitter {}

const mockSocket = new TestEmitter();
mockSocket.bind = jest.fn();
mockSocket.send = jest.fn();

jest.mock("dgram", () => ({
  createSocket: jest.fn(() => mockSocket),
}));

jest.mock(
  "../build/constants.json",
  () => ({
    hosts: {
      remote: "192.168.10.1",
    },
    ports: {
      command: 8889,
      response: 8001,
      state: 8890,
      video: 11111,
    },
  }),
  { virtual: true }
);

const commandExchange = require("../build/exchanger"),
  dgram = require("dgram"),
  constants = require("../build/constants.json"),
  { faker } = require("@faker-js/faker");

describe("exchange", () => {
  beforeEach(() => {
    commandExchange.local.state = "idle";
  });

  it("should dgram should has been initialized with udp4", () => {
    expect(dgram.createSocket).toBeCalledWith("udp4");
  });

  it("should bind to listening port", () => {
    expect(mockSocket.bind).toBeCalledWith(constants.ports.response);
  });

  it("if message on event listener should alter state", () => {
    expect(commandExchange.local.state).toEqual("idle");
    let newState = faker.datatype.uuid();
    mockSocket.emit("message", newState);
    expect(commandExchange.local.state).toEqual(newState);
  });

  it("should resolve if command returns ok", async () => {
    const expectedResult = faker.datatype.uuid(),
      command = faker.datatype.uuid(),
      expecteBuffer = Buffer.from(command);

    const sendCommand = commandExchange.send(command);
    mockSocket.emit("message", "ok");
    jest.advanceTimersByTime(1000);

    const result = await sendCommand;

    expect(mockSocket.send).toBeCalledWith(
      expecteBuffer,
      0,
      expecteBuffer.length,
      constants.ports.command,
      constants.hosts.remote,
      expect.any(Function)
    );
    expect(result).toEqual("ok");
    expect(commandExchange.local.state).toEqual("idle");
    expect(clearInterval).toBeCalled();
    expect(clearTimeout).toBeCalled();
  });

  it("should reject if command returns error", async () => {
    const expectedResult = faker.datatype.uuid(),
      command = faker.datatype.uuid(),
      expecteBuffer = Buffer.from(command);

    const send = commandExchange.send(command);
    mockSocket.emit("message", "error");
    jest.advanceTimersByTime(1000);

    try {
      await send;
    } catch (error) {
      expect(error).toEqual("error");
      expect(commandExchange.local.state).toEqual("idle");
      expect(clearInterval).toBeCalled();
      expect(clearTimeout).toBeCalled();
    }
  });

  it("should reject if timeout", async () => {
    const expectedResult = faker.datatype.uuid(),
      command = faker.datatype.uuid(),
      expecteBuffer = Buffer.from(command);

    const send = commandExchange.send(command);
    jest.advanceTimersByTime(10000);

    try {
      await send;
    } catch (error) {
      expect(error).toEqual("error");
      expect(commandExchange.local.state).toEqual("idle");
      expect(clearInterval).toBeCalled();
      expect(clearTimeout).toBeCalled();
    }
  });

  it("should fail promise if error", async () => {
    mockSocket.send.mockImplementation((_, __, ___, ____, _____, fun) =>
      fun(faker.datatype.uuid())
    );

    try {
      let send = commandExchange.send(faker.datatype.uuid());
      jest.advanceTimersByTime(1000);
      await send;
    } catch (error) {
      expect(error).toEqual("error");
      expect(commandExchange.local.state).toEqual("idle");
      expect(clearInterval).toBeCalled();
      expect(clearTimeout).toBeCalled();
    }
  });

  it("if a command is running no other command should be allowed", async () => {
    mockSocket.send.mockImplementation((_, __, ___, ____, _____, fun) =>
      fun(faker.datatype.uuid())
    );

    let send = commandExchange.send(faker.datatype.uuid());
    let send2 = commandExchange.send(faker.datatype.uuid());

    try {
      await send2;
    } catch (error) {
      expect(error).toEqual("error");
    }

    mockSocket.emit("message", "ok");
    jest.advanceTimersByTime(1000);

    const result = await send;

    expect(result).toEqual("ok");
    expect(commandExchange.local.state).toEqual("idle");
    expect(clearInterval).toBeCalled();
    expect(clearTimeout).toBeCalled();
  });
});
