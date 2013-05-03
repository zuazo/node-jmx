var java = require("java");

function JmxServiceUrlBuilder(serviceOrHost, port, protocol, urlPath)  {
  if (typeof serviceOrHost !== "string") {
    throw Error("JmxServiceUrlBuilder(): first argument, serviceOrHost, should be a string");
  }
  if (serviceOrHost.substr(0, 12) === "service:jmx:") {
    // TODO: this must be done async
    return java.newInstanceSync("javax.management.remote.JMXServiceURL", serviceOrHost);
  } else {
    // TODO: this must be done async
    port = java.newInstanceSync("java.lang.Integer", port);
    protocol = protocol || "rmi";
    if (typeof urlPath === "undefined") {
      urlPath = "/jndi/" + protocol + "://" + serviceOrHost + ":" + port + "/jmx" + protocol;
    }
    // TODO: this must be done async
    return java.newInstanceSync("javax.management.remote.JMXServiceURL", protocol, serviceOrHost, port, urlPath);
  }
}

module.exports = JmxServiceUrlBuilder;

