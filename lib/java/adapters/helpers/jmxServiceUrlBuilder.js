var java = require("java");

function JmxServiceUrlBuilder(serviceOrHost, port, protocol, urlPath)  {
  if (typeof serviceOrHost !== "string") {
    throw Error("JmxServiceUrlBuilder(): first argument, serviceOrHost, should be a string");
  }
  if (serviceOrHost.substr(0, 12) === "service:jmx:") {
    return java.newInstanceSync("javax.management.remote.JMXServiceURL", serviceOrHost);
  } else {
    port = java.newInstanceSync("java.lang.Integer", port);
    protocol = protocol || "rmi";
    if (typeof urlPath === "undefined") {
      urlPath = "/jndi/" + protocol + "://" + serviceOrHost + ":" + port + "/jmx" + protocol;
    }
    return java.newInstanceSync("javax.management.remote.JMXServiceURL", protocol, serviceOrHost, port, urlPath);
  }
}

module.exports = JmxServiceUrlBuilder;

