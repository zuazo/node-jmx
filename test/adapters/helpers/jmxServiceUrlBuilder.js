var assert = require("assert"),
    java = require("java"),
    JmxServiceUrlBuilder = require("./../../../lib/adapters/helpers/jmxServiceUrlBuilder");

describe("JmxServiceUrlBuilder", function() {

  it("should accept service name as first argument", function() {
    var service = JmxServiceUrlBuilder("service:jmx:rmi://jndi/rmi://localhost:3000/jmxrmi");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://jndi/rmi://localhost:3000/jmxrmi");
  });

  it("should accept host name and port as arguments", function() {
    var service = JmxServiceUrlBuilder("localhost", 3000);
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://localhost:3000/jndi/rmi://localhost:3000/jmxrmi");
  });

  it("should accept host name and port in string form as arguments", function() {
    var service = JmxServiceUrlBuilder("localhost", "3000");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://localhost:3000/jndi/rmi://localhost:3000/jmxrmi");
  });

  it("should accept protocol as third argument", function() {
    var service = JmxServiceUrlBuilder("localhost", 3000, "proto1");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:proto1://localhost:3000/jndi/proto1://localhost:3000/jmxproto1");
  });

  it("should accept urlPath as fourth argument", function() {
    var service = JmxServiceUrlBuilder("localhost", 3000, "rmi", "/myUrl");
    assert.strictEqual(service.getClassSync().getNameSync(), "javax.management.remote.JMXServiceURL");
    assert.strictEqual(service.toStringSync(), "service:jmx:rmi://localhost:3000/myUrl");
  });

  it("should throw an exception when the first argument is not a string", function() {
    assert.throws(
      function() {
        JmxServiceUrlBuilder(null);
      },
      "JmxServiceUrlBuilder(): first argument, serviceOrHost, should be a string"
    );
  });

});

