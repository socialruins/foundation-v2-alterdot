const Logger = require("../main/logger");
const Stratum = require("../main/stratum");
const config = require("../../configs/example");
const configMain = require("../../configs/main.js");
const nock = require("nock");
const testdata = require("../../daemon/test/daemon.mock");

config.primary.address = "CXyycFp6xwCsRVX1WgRkxwS1d5WdhrZB4t";
config.primary.recipients[0].address = "CXyycFp6xwCsRVX1WgRkxwS1d5WdhrZB4t";
config.primary.daemons = [
  {
    host: "127.0.0.1",
    port: "31050",
    username: "foundation",
    password: "foundation",
  },
];

nock.disableNetConnect();
nock.enableNetConnect("127.0.0.1");

////////////////////////////////////////////////////////////////////////////////

describe("Test stratum functionality", () => {
  let configCopy, configMainCopy, rpcDataCopy;
  beforeEach(() => {
    configCopy = JSON.parse(JSON.stringify(config));
    configMainCopy = JSON.parse(JSON.stringify(configMain));
    rpcDataCopy = JSON.parse(JSON.stringify(testdata.getBlockTemplate()));
  });

  beforeEach(() => nock.cleanAll());
  afterAll(() => nock.restore());
  beforeAll(() => {
    if (!nock.isActive()) nock.activate();
    nock.enableNetConnect();
  });

  test("Test initialization of stratum", () => {
    const logger = new Logger(configMainCopy);
    const stratum = new Stratum(logger, configCopy, configMainCopy);
    expect(typeof stratum.config).toBe("object");
    expect(typeof stratum.setupStratum).toBe("function");
  });

  test("Test stratum pool setup [1]", (done) => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const logger = new Logger(configMainCopy);
    const stratum = new Stratum(logger, configCopy, configMainCopy);
    nock("http://127.0.0.1:31050")
      .post("/", (body) => body.method === "getpeerinfo")
      .reply(
        200,
        JSON.stringify({
          id: "nocktest",
          error: null,
          result: null,
        })
      );
    nock("http://127.0.0.1:31000")
      .post("/", (body) => body.method === "getpeerinfo")
      .reply(
        200,
        JSON.stringify({
          id: "nocktest",
          error: null,
          result: null,
        })
      );
    nock("http://127.0.0.1:31050")
      .post("/")
      .reply(
        200,
        JSON.stringify([
          {
            id: "nocktest",
            error: null,
            result: {
              isvalid: true,
              address: "CXyycFp6xwCsRVX1WgRkxwS1d5WdhrZB4t",
            },
          },
          { id: "nocktest", error: null, result: { networkhashps: 0 } },
          {
            id: "nocktest",
            error: null,
            result: { chain: "main", difficulty: 0 },
          },
          {
            id: "nocktest",
            error: null,
            result: { protocolversion: 1, connections: 1 },
          },
        ])
      );
    nock("http://127.0.0.1:31050")
      .persist()
      .post("/", (body) => body.method === "getblocktemplate")
      .reply(
        200,
        JSON.stringify({
          id: "nocktest",
          error: null,
          result: rpcDataCopy,
        })
      );
    stratum.setupStratum(() => {
      stratum.stratum.network.on("network.stopped", () => done());
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching("is lower than the difficulty on port")
      );
      stratum.stratum.network.stopNetwork();
      console.log.mockClear();
    });
  });

  test("Test stratum pool setup [2]", (done) => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const logger = new Logger(configMainCopy);
    const stratum = new Stratum(logger, configCopy, configMainCopy);
    nock("http://127.0.0.1:31050")
      .post("/", (body) => body.method === "getpeerinfo")
      .reply(
        200,
        JSON.stringify({
          id: "nocktest",
          error: null,
          result: null,
        })
      );
    nock("http://127.0.0.1:31000")
      .post("/", (body) => body.method === "getpeerinfo")
      .reply(
        200,
        JSON.stringify({
          id: "nocktest",
          error: null,
          result: null,
        })
      );
    nock("http://127.0.0.1:31050")
      .post("/")
      .reply(
        200,
        JSON.stringify([
          {
            id: "nocktest",
            error: null,
            result: {
              isvalid: true,
              address: "CXyycFp6xwCsRVX1WgRkxwS1d5WdhrZB4t",
            },
          },
          { id: "nocktest", error: null, result: { networkhashps: 0 } },
          {
            id: "nocktest",
            error: null,
            result: { chain: "main", difficulty: 0 },
          },
          {
            id: "nocktest",
            error: null,
            result: { protocolversion: 1, connections: 1 },
          },
        ])
      );
    nock("http://127.0.0.1:31050")
      .persist()
      .post("/", (body) => body.method === "getblocktemplate")
      .reply(
        200,
        JSON.stringify({
          id: "nocktest",
          error: null,
          result: rpcDataCopy,
        })
      );
    stratum.forkId = "0";
    stratum.setupStratum(() => {
      stratum.stratum.network.on("network.stopped", () => done());
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching("is lower than the difficulty on port")
      );
      stratum.stratum.network.stopNetwork();
      console.log.mockClear();
    });
  });
});
