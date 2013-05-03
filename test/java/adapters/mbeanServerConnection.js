var assert = require("assert"),
    java = require("java"),
    MBeanServerConnection = require("./../../../lib/java/adapters/mbeanServerConnection");

describe("MBeanServerConnection", function() {
  var mbeanServerConnection;
  beforeEach(function() {
    mbeanServerConnection = new MBeanServerConnection("uri1");

    var jmxConnector = {
      getMBeanServerConnection: function(callback) {
        callback(undefined, {});
      }
    };
    mbeanServerConnection.JMXConnectorFactory.connect = function(jmxServiceUrl, map, callback) {
      callback(undefined, jmxConnector);
    };
  });

  describe("#MBeanServerConnection", function() {
    var emitted;
    beforeEach(function() {
      emitted = [];
      mbeanServerConnection.emit = function(ev) {
        emitted.push(ev);
      };
    });

    it("should receive URI as argument", function() {
      var mbeanServerConnection = new MBeanServerConnection("uri2");
      assert.strictEqual(mbeanServerConnection.jmxServiceUrl, "uri2");
    });

    it("should subscribe to javaReflector error events", function() {
      mbeanServerConnection.javaReflection.emit("error");
      assert.deepEqual(emitted, [ "error" ]);
    });

  });

  describe("#connect", function() {

    it("should emit connect event when connected", function(done) {
      mbeanServerConnection.emit = function(ev) {
        if (ev === "connect") {
          done();
        }
      };
      mbeanServerConnection.connect();
    });

    it("should receive URI as argument", function() {
      mbeanServerConnection.connect("uri2");
      assert.strictEqual(mbeanServerConnection.jmxServiceUrl, "uri2");
    });

  });

  describe("#disconnect", function() {
    beforeEach(function() {
      mbeanServerConnection.jmxConnector = {
        close: function(callback) {
          callback(undefined, {});
        }
      };
    });

    it("should try to close de connection when called", function(done) {
      mbeanServerConnection.jmxConnector.close = function() {
        done();
      };
      mbeanServerConnection.close();
    });

    it("should emit disconnect event when connected", function(done) {
      mbeanServerConnection.emit = function(ev) {
        if (ev === "disconnect") {
          done();
        }
      };
      mbeanServerConnection.close();
    });

  });

  function testOnConnected(onConnected) {
    mbeanServerConnection.emit = function(ev) {
      if (ev === "connect") {
        onConnected();
      }
    };
    mbeanServerConnection.connect();
  }

  it("#queryMBeans", function(done) {
    testOnConnected(function() {
      mbeanServerConnection.mbeanServerConnection.queryMBeans = function(objName, queryObject, callback) {
        var instance = java.newInstanceSync("javax.management.ObjectInstance", "MBean1:type=MBean1", "java.lang.Object");
        var instances = {
          toArray: function(callback) {
            callback(undefined, [instance]);
          }
        };
        callback(undefined, instances);
      };
      mbeanServerConnection.queryMBeans(null, "MBean1:type=MBean1", function(instance) {
        assert.strictEqual(instance.getObjectNameSync().toStringSync(), "MBean1:type=MBean1");
        done();
      });
    });
  });

  function testReflectionCall(method, methodParamsClass, methodParams, callback) {
    mbeanServerConnection.mbeanServerConnection = "mbeanServerConnection";
    mbeanServerConnection.javaReflection.invokeMethod = function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      assert.strictEqual(obj, mbeanServerConnection.mbeanServerConnection);
      assert.strictEqual(method, method2);
      callback.apply(mbeanServerConnection, arguments);
    };
    mbeanServerConnection[method].apply(mbeanServerConnection, methodParams);
  }

  it("#getAttribute", function(done) {
    var method = "getAttribute";
    var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String" ];
    var methodParams = [ "name", "attribute" ];
    testReflectionCall(method, methodParamsClass, methodParams, function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      assert.deepEqual(methodParamsClass, methodParamsClass2);
      assert.deepEqual(methodParams, methodParams2);
      done();
    });
  });

  it("#getDefaultDomain", function(done) {
    var method = "getDefaultDomain";
    var methodParamsClass = [];
    var methodParams = [];
    testReflectionCall(method, methodParamsClass, methodParams, function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      assert.deepEqual(methodParamsClass, methodParamsClass2);
      assert.deepEqual(methodParams, methodParams2);
      done();
    });
  });

  it("#getDomains", function(done) {
    var method = "getDomains";
    var methodParamsClass = [];
    var methodParams = [];
    testReflectionCall(method, methodParamsClass, methodParams, function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      assert.deepEqual(methodParamsClass, methodParamsClass2);
      assert.deepEqual(methodParams, methodParams2);
      done();
    });
  });

  it("#getMBeanCount", function(done) {
    var method = "getMBeanCount";
    var methodParamsClass = [];
    var methodParams = [];
    testReflectionCall(method, methodParamsClass, methodParams, function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      assert.deepEqual(methodParamsClass, methodParamsClass2);
      assert.deepEqual(methodParams, methodParams2);
      done();
    });
  });

  it("#setAttribute", function(done) {
    var method = "setAttribute";
    var methodParamsClass = [ "javax.management.ObjectName", "javax.management.Attribute" ];
    var methodParams = [ "name", "attribute" ];
    testReflectionCall(method, methodParamsClass, methodParams, function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      assert.deepEqual(methodParamsClass, methodParamsClass2);
      assert.deepEqual(methodParams, methodParams2);
      done();
    });
  });

  it("#invoke", function(done) {
    var method = "invoke";

    var paramsArray = java.newArray("java.lang.Object", [ "params" ]);
    var signatureArray = java.newArray("java.lang.String", [ "signature" ]);

    var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String", "[Ljava.lang.Object;", "[Ljava.lang.String;" ];
    var methodParams = [ "name", "operationName", [ "params" ], [ "signature" ] ];
    testReflectionCall(method, methodParamsClass, methodParams, function(obj, method2, methodParamsClass2, methodParams2, callback2) {
      var newMethodParams = [ "name", "operationName", paramsArray, signatureArray];
      assert.deepEqual(methodParamsClass, methodParamsClass2);
      assert.deepEqual(newMethodParams , methodParams2);
      done();
    });
  });

});

