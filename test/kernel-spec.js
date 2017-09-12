import { expect } from "chai";

import * as kernels from "../src/kernels";

// For the test using a websocket
global.WebSocket = require("ws");

const serverConfig = {
  endpoint: "http://localhost:8888",
  crossDomain: true
};

describe("kernels", () => {
  describe("get", () => {
    it("creates an AjaxObservable configured for getting a kernel by id", () => {
      const id = "0000-1111-2222-3333";
      const kernel$ = kernels.get(serverConfig, id);
      const request = kernel$.request;
      expect(request.url).to.equal(`http://localhost:8888/api/kernels/${id}`);
      expect(request.method).to.equal("GET");
    });
  });

  describe("list", () => {
    it("creates an AjaxObservable configured for listing kernels", () => {
      const kernel$ = kernels.list(serverConfig);
      const request = kernel$.request;
      expect(request.url).to.equal("http://localhost:8888/api/kernels");
      expect(request.method).to.equal("GET");
      expect(request.crossDomain).to.equal(true);
    });
  });

  describe("start", () => {
    it("creates an AjaxObservable configured for starting a kernel", () => {
      const kernel$ = kernels.start(serverConfig, "python3000", "/tmp");
      const request = kernel$.request;
      expect(request.url).to.equal("http://localhost:8888/api/kernels");
      expect(request.headers).to.deep.equal({
        "Content-Type": "application/json"
      });
      expect(request.method).to.equal("POST");
      expect(request.body.path).to.equal("/tmp");
      expect(request.body.kernel_name).to.equal("python3000");
    });
  });

  describe("kill", () => {
    it("creates an AjaxObservable configured for killing a kernel", () => {
      const id = "0000-1111-2222-3333";
      const kernel$ = kernels.kill(serverConfig, id);
      const request = kernel$.request;
      expect(request.url).to.equal(`http://localhost:8888/api/kernels/${id}`);
      expect(request.method).to.equal("DELETE");
    });
  });

  describe("interrupt", () => {
    it("creates an AjaxObservable configured for interrupting a kernel", () => {
      const id = "0000-1111-2222-3333";
      const kernel$ = kernels.interrupt(serverConfig, id);
      const request = kernel$.request;
      expect(request.url).to.equal(
        `http://localhost:8888/api/kernels/${id}/interrupt`
      );
      expect(request.method).to.equal("POST");
    });
  });

  describe("restart", () => {
    it("creates an AjaxObservable configured for restarting a kernel", () => {
      const id = "0000-1111-2222-3333";
      const kernel$ = kernels.restart(serverConfig, id);
      const request = kernel$.request;
      expect(request.url).to.equal(
        `http://localhost:8888/api/kernels/${id}/restart`
      );
      expect(request.method).to.equal("POST");
    });
  });

  describe("formWebSocketURL", () => {
    it("creates websocket URLs that match the originating scheme", () => {
      const config = {
        endpoint: "https://tmp58.tmpnb.org/user/TOTefPUbkgOu"
      };
      const wsURL = kernels.formWebSocketURL(config, "0000-1111");
      expect(wsURL).to.equal(
        "wss://tmp58.tmpnb.org/user/TOTefPUbkgOu/api/kernels/0000-1111/channels"
      );

      config.endpoint = "http://127.0.0.1:8888";

      const wsURL2 = kernels.formWebSocketURL(config, "4444-2222");
      expect(wsURL2).to.equal(
        "ws://127.0.0.1:8888/api/kernels/4444-2222/channels"
      );
    });
  });

  describe("connect", () => {
    it("returns a WebSocketSubject attached to the kernel", () => {
      const subject = kernels.connect(serverConfig, "777");
      expect(subject.url).to.equal(
        "ws://localhost:8888/api/kernels/777/channels"
      );
    });
  });
});
