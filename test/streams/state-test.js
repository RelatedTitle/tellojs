const EventEmitter = require("events");
class TestEmitter extends EventEmitter {}

const mockSocket = new TestEmitter();
mockSocket.bind = jest.fn();
mockSocket.close = jest.fn();

jest.mock("dgram", () => ({
  createSocket: jest.fn(() => mockSocket),
}));

jest.mock(
  "../../build/constants.json",
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

const state = require("../../build/streams/state.js"),
  dgram = require("dgram"),
  constants = require("../../build/constants.json"),
  { faker } = require("@faker-js/faker");

describe("state stream", () => {
  it("should dgram should has been initialized with udp4", () => {
    expect(dgram.createSocket).toBeCalledWith("udp4");
  });

  it("should bind to listening port", () => {
    state.bind();
    expect(mockSocket.bind).toBeCalledWith(constants.ports.state);
  });

  const messageGenerator = () => {
    const pitch = faker.datatype.number(100),
      roll = faker.datatype.number(100),
      yaw = faker.datatype.number(100),
      vgx = faker.datatype.number(100),
      vgy = faker.datatype.number(100),
      vgz = faker.datatype.number(100),
      templ = faker.datatype.number(100),
      temph = faker.datatype.number(100),
      tof = faker.datatype.number(100),
      h = faker.datatype.number(100),
      bat = faker.datatype.number(100),
      baro = faker.datatype.number(100),
      time = faker.datatype.number(100),
      agx = faker.datatype.number(100),
      agy = faker.datatype.number(100),
      agz = faker.datatype.number(100),
      resultString = `pitch:${pitch};roll:${roll};yaw:${yaw};vgx:${vgx};vgy:${vgy};vgz:${vgz};templ:${templ};temph:${temph};tof:${tof};h:${h};bat:${bat};baro:${baro};time:${time};agx:${agx};agy:${agy};agz:${agz};`;
  };
  //pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:80;temph:82;tof:10;h:0;bat:88;baro:23.88;time:0;agx:-8.00;agy:-12.00;agz:-990.00;
  it("should get an event Emitter that receives messages from udp", async () => {
    const emitter = state.bind(),
      pitch = faker.datatype.number(100),
      roll = faker.datatype.number(100),
      yaw = faker.datatype.number(100),
      vgx = faker.datatype.number(100),
      vgy = faker.datatype.number(100),
      vgz = faker.datatype.number(100),
      templ = faker.datatype.number(100),
      temph = faker.datatype.number(100),
      tof = faker.datatype.number(100),
      h = faker.datatype.number(100),
      bat = faker.datatype.number(100),
      baro = faker.datatype.number(100),
      time = faker.datatype.number(100),
      agx = faker.datatype.number(100),
      agy = faker.datatype.number(100),
      agz = faker.datatype.number(100),
      message = `pitch:${pitch};roll:${roll};yaw:${yaw};vgx:${vgx};vgy:${vgy};vgz:${vgz};templ:${templ};temph:${temph};tof:${tof};h:${h};bat:${bat};baro:${baro};time:${time};agx:${agx};agy:${agy};agz:${agz};`,
      expected = {
        pitch,
        roll,
        yaw,
        speed: { x: vgx, y: vgy, z: vgz },
        temperature: { low: templ, high: temph },
        tof,
        heigh: h,
        battery: bat,
        barometer: baro,
        time,
        acceleration: { x: agx, y: agy, z: agz },
      },
      result = new Promise((resolve, reject) => {
        emitter.on("message", (res) => {
          resolve(res);
        });
      });
    mockSocket.emit("message", Buffer.from(message, "utf8"));
    expect(emitter).toBeInstanceOf(EventEmitter);
    expect(await result).toEqual(expected);
  });

  it("should close socket on listening port and reset emitter", () => {
    state.close();
    expect(mockSocket.close).toBeCalled();
  });
});
