"use strict";
const Webda = require("../../lib/index");

class DebugMailer extends Webda.Executor {
  constructor(webda, name, params) {
    super(webda, name, params);
    this.sent = [];
    webda.registerCSRFFilter(this);
    webda.on("Webda.Execute", async (executor, ctx) => {
      let route = ctx.getHttpRequest();
      if (
        route.url === "/route/unaccessible" ||
        route.url === "/service/impossible"
      ) {
        if (route.headers && route.headers["X-Api-Key"] === "yep") {
          return;
        }
        throw 403;
      }
      return false;
    });
    this._addRoute("/service/impossible", ["GET"], this._fake);
  }

  _fake(ctx) {
    ctx.write({ title: "Coucou" });
  }

  checkCSRF(origin) {
    return origin === "DebugMailer";
  }

  getModda() {}

  send(options, callback) {
    this.sent.push(options);
  }
}

module.exports = DebugMailer;
