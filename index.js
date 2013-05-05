var Client = require("./lib/client"),
    assert = require("assert");

function createClient(options) {
  var serviceOrHost, port, protocol, urlPath;
  assert.ok(options, "options is required");
  if (options.service) {
    serviceOrHost = options.service;
  } else {
    serviceOrHost = options.host || "localhost";
    protocol = options.protocol;
    assert.ok(options.port, "port is required");
    port = options.port;
    urlPath = options.urlPath;
  }
  return new Client(serviceOrHost, port, protocol, urlPath, options.username, options.password);
}

module.exports = {
  createClient: createClient
};

