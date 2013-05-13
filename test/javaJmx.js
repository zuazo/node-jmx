var libpath = process.env["JMX_COVERAGE"] ? "./../lib-cov" : "./../lib";

var assert = require("assert"),
    java = require("java"),
    JavaJmx = require(libpath + "/javaJmx.js"),
    MBeanServerConnection = require(libpath + "/adapters/mbeanServerConnection.js");

describe("JavaJmx", function() {
  var javaJmx;
  beforeEach(function() {
    javaJmx = new JavaJmx("localhost", 3000);
    javaJmx.mbeanServerConnection.queryMBeans = function(objName, queryObject, callback) {
      var instance = java.newInstanceSync("javax.management.ObjectInstance", "MBean1:type=MBean1", "java.lang.Object");
      callback(instance);
    };
  });

  describe("#JavaJmx", function() {

    it("should return a JavaJmx object passing the correct arguments", function() {
      assert.ok(javaJmx instanceof JavaJmx);
    });

    it("should create an internal MBeanServerConnection object", function() {
      assert.ok(javaJmx.mbeanServerConnection instanceof MBeanServerConnection);
    });

    describe("should subscribe to MBeanServerConnection events", function() {
      var emitted;
      beforeEach(function() {
        emitted = [];
        javaJmx.emit = function(ev) {
          emitted.push(ev);
        };
      });

      it("connect event", function() {
        javaJmx.mbeanServerConnection.emit("connect");
        assert.deepEqual(emitted, [ "connect" ]);
      });

      it("disconnect event", function() {
        javaJmx.mbeanServerConnection.emit("disconnect");
        assert.deepEqual(emitted, [ "disconnect" ]);
      });

      it("error event", function() {
        javaJmx.mbeanServerConnection.emit("error");
        assert.deepEqual(emitted, [ "error" ]);
      });

    });

    it("should close the connection when a \"Connection Refused\" java error is returned", function(done) {
      javaJmx.mbeanServerConnection.close = function() {
        done();
      };
      javaJmx.on("error", function(err) {
        assert.strictEqual(err, "java.net.ConnectException: Connection refused");
      });
      javaJmx.mbeanServerConnection.emit("error", "java.net.ConnectException: Connection refused");
    });

  });

  describe("#JmxServiceUrl", function() {
    it("should create a JMXServiceURL java object", function() {
      var jmxServiceUrl = javaJmx.JmxServiceUrl("localhost", 3000);
      assert.strictEqual(
        jmxServiceUrl.getClassSync().getNameSync(),
        "javax.management.remote.JMXServiceURL"
      );
    });
  });

  it("#connect", function(done) {
    javaJmx.mbeanServerConnection.connect = function(jmxServiceUrl, undef) {
      assert.strictEqual(jmxServiceUrl, "jmxServiceUrl");
      assert.strictEqual(undef, undefined);
      done();
    };
    javaJmx.connect("jmxServiceUrl");
  });

  it("#disconnect", function(done) {
    javaJmx.mbeanServerConnection.close = function(undef) {
      assert.strictEqual(undef, undefined);
      done();
    };
    javaJmx.disconnect();
  });

  it("#getAttribute", function(done) {
    javaJmx.mbeanServerConnection.getAttribute = function(objectName, attributeName, callback, undef) {
      assert.strictEqual(objectName.toString(), "MBean1:type=MBean1");
      assert.strictEqual(attributeName, "attributeName");
      assert.strictEqual(typeof callback, "function");
      assert.strictEqual(undef, undefined);
      callback();
    };
    javaJmx.getAttribute("mbean", "attributeName", function(attr) {
      done();
    });
  });

  it("#getDefautlDomain", function(done) {
    javaJmx.mbeanServerConnection.getDefaultDomain = function(undef) {
      assert.strictEqual(undef, undefined);
      done();
    };
    javaJmx.getDefaultDomain();
  });

  it("#getDomains", function(done) {
    javaJmx.mbeanServerConnection.getDomains = function(undef) {
      assert.strictEqual(undef, undefined);
      done();
    };
    javaJmx.getDomains();
  });

  it("#getMBeanCount", function(done) {
    javaJmx.mbeanServerConnection.getMBeanCount = function(undef) {
      assert.strictEqual(undef, undefined);
      done();
    };
    javaJmx.getMBeanCount();
  });

  describe("#setAttribute", function() {

    it("should call MBeanServer.setAttribute with the correct parameters", function(done) {
      javaJmx.mbeanServerConnection.setAttribute = function(objectName, attribute, callback, undef) {
        assert.strictEqual(objectName.toString(), "MBean1:type=MBean1");
        assert.strictEqual(attribute.getClassSync().getNameSync(), "javax.management.Attribute");
        assert.strictEqual(attribute.getNameSync(), "attributeName");
        assert.strictEqual(attribute.getValueSync(), "value");
        assert.strictEqual(typeof callback, "function");
        assert.strictEqual(undef, undefined);
        callback();
      };
      javaJmx.setAttribute("mbean", "attributeName", "value", done);
    })

    it("should accept the optional className parameter", function(done) {
      javaJmx.mbeanServerConnection.setAttribute = function(objectName, attribute, callback) {
        assert.strictEqual(attribute.getValueSync().getClassSync().getNameSync(), "javax.management.ObjectName");
        assert.strictEqual(attribute.getValueSync().getDomainSync(), "domain");
        callback();
      };
      javaJmx.setAttribute("mbean", "attributeName", [ "domain", "name", "value" ], "javax.management.ObjectName", done);
    })

  });

  it("#setCredentials", function(done) {
    javaJmx.mbeanServerConnection.setCredentials = function(username, password, undef) {
      assert.strictEqual(username, "username");
      assert.strictEqual(password, "password");
      assert.strictEqual(undef, undefined);
      done();
    };
    javaJmx.setCredentials("username", "password");
  });

  describe("#invoke", function() {

    it("should accept a callback as the fourth parameter", function(done) {
      javaJmx.mbeanServerConnection.invoke = function(objectName, methodName, params, signature, callback, undef) {
        assert.strictEqual(objectName.toString(), "MBean1:type=MBean1");
        assert.strictEqual(methodName, "methodName");
        assert.deepEqual(params, [ "param1" ]);
        assert.deepEqual(signature, [ "java.lang.String" ]);
        assert.strictEqual(typeof callback, "function");
        assert.strictEqual(undef, undefined);
        callback();
      };
      javaJmx.invoke("mbean", "methodName", [ "param1" ], function(value) {
        done();
      });
    });

    it("should accept a signature as the fourth parameter", function(done) {
      javaJmx.mbeanServerConnection.invoke = function(objectName, methodName, params, signature, callback, undef) {
        assert.strictEqual(objectName.toString(), "MBean1:type=MBean1");
        assert.strictEqual(methodName, "methodName");
        assert.deepEqual(params, [ "param1" ]);
        assert.deepEqual(signature, [ "int" ]);
        assert.strictEqual(typeof callback, "function");
        assert.strictEqual(undef, undefined);
        callback();
      };
      javaJmx.invoke("mbean", "methodName", [ "param1" ], [ "int" ], function(value) {
        done();
      });
    });

    it("should throw an exception when params has unknown types", function(done) {
      javaJmx.mbeanServerConnection.invoke = function(objectName, methodName, params, signature, callback, undef) {};
      javaJmx.on("error", function(err) {
        assert.ok(/v8ToJavaClass[(][)]: unknown object type/.test(err));
        done();
      });
      javaJmx.invoke("mbean", "methodName", [ undefined ], function() {});
    });

  });

});
