var libpath = process.env.JMX_COVERAGE ? "./../../../lib-cov" : "./../../../lib";

var assert = require("assert"),
    java = require("java"),
    JmxServiceUrlBuilder = require(libpath + "/adapters/helpers/jmxServiceUrlBuilder");

describe("JmxServiceUrlBuilder", function() {

  it("accepts service name as first argument", function() {
    var service = JmxServiceUrlBuilder("service:jmx:rmi://jndi/rmi://localhost:3000/jmxrmi");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://jndi/rmi://localhost:3000/jmxrmi");
  });

  it("accepts host name and port as arguments", function() {
    var service = JmxServiceUrlBuilder("localhost", 3000);
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://localhost:3000/jndi/rmi://localhost:3000/jmxrmi");
  });

  it("accepts host name and port in string form as arguments", function() {
    var service = JmxServiceUrlBuilder("localhost", "3000");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://localhost:3000/jndi/rmi://localhost:3000/jmxrmi");
  });

  it("accepts protocol as third argument", function() {
    var service = JmxServiceUrlBuilder("localhost", 3000, "proto1");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:proto1://localhost:3000/jndi/proto1://localhost:3000/jmxproto1");
  });

  it("accepts urlPath as fourth argument", function() {
    var service = JmxServiceUrlBuilder("localhost", 3000, "rmi", "/myUrl");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://localhost:3000/myUrl");
  });

  it("throws an exception when the first argument is not a string", function() {
    assert.throws(
      function() {
        JmxServiceUrlBuilder(null);
      },
      "JmxServiceUrlBuilder(): first argument, serviceOrHost, should be a string"
    );
  });

});

