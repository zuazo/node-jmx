var assert = require("assert"),
    java = require("java"),
    JavaReflection = require("./../../../lib/java/adapters/javaReflection");

describe("JavaReflection", function() {
  var javaReflection;
  beforeEach(function() {
    javaReflection = new JavaReflection();
  });

  describe("#invokeMethod", function() {

    function testInvokeMethod(obj, methodName, paramsClass, params, callback) {
      var directResult = obj[methodName + "Sync"].apply(obj, params);
      javaReflection.invokeMethod(obj, methodName, paramsClass, params, function(result) {
        assert.deepEqual(result, directResult);
        callback(result);
      });
    }

    it("should be able to call java methods with no arguments", function(done) {
      var obj = java.newInstanceSync("javax.management.Attribute", "attributeName1", "value1");
      var paramsClass = [];
      var params = [];
      var methodName = "getName";

      testInvokeMethod(obj, methodName, paramsClass, params, function() {
        done();
      });
    });

    it("should be able to call java methods with arguments", function(done) {
      var obj1 = java.newInstanceSync("javax.management.Attribute", "attributeName1", "value1");
      var obj2 = java.newInstanceSync("javax.management.Attribute", "attributeName2", "value2");
      var paramsClass = [ "java.lang.Object" ];
      var params = [ obj2 ];
      var methodName = "equals";

      testInvokeMethod(obj1, methodName, paramsClass, params, function() {
        done();
      });
    });

    it("should emit an error when the object method does not exist", function(done) {
      var obj1 = java.newInstanceSync("javax.management.Attribute", "attributeName1", "value1");
      var paramsClass = [];
      var params = [];
      var methodName = "nonExistentMethod";
      javaReflection.emit = function(ev, data) {
        if (ev === "error" && data.toString().match(/java\.lang\.NoSuchMethodException/)) {
          done();
        }
      }
      javaReflection.invokeMethod(obj1, methodName, paramsClass, params, function() {
        assert(false, "no exception thrown");
      });
    });

  });
});

