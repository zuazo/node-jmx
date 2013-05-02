var Client = require("./lib/client"),
    assert = require("assert");

function createClient(options) { 
  assert.ok(options, "options is required");
  if (options.service) {
    var serviceOrHost = options.service;
  } else {
    var serviceOrHost = options.host || "localhost";
    var protocol = options.protocol;
    assert.ok(options.port, "port is required");
    var port = options.port;
    var urlPath = options.urlPath;
  }
  return new Client(serviceOrHost, port, protocol, urlPath);
}

module.exports = {
  createClient: createClient,
  Client: Client,
};

