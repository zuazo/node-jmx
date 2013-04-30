var java = require('java'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

function JavaReflection() {
  EventEmitter.call(this);
}
util.inherits(JavaReflection, EventEmitter);

module.exports = JavaReflection;

JavaReflection.prototype.invokeMethod = function(obj, methodName, paramsClass, params, callback) {
  var self = this;

  function getMethod(obj, methodName, paramsClass, callback) {

    function newClassArray(params) {
      var classArray = [];
      params.forEach(function(value) {
        var javaClass = java.callStaticMethodSync("java.lang.Class", "forName", value);
        classArray.push(javaClass);
      });
      var paramsClass = java.newArray("java.lang.Class", classArray);
      return paramsClass;
    }

    var javaParamsClass = newClassArray(paramsClass);
    obj.getClass(function(err, javaClass) {
      if (err) {
        console.error(err);
        self.emit("error", err);
        return;
      }
      javaClass.getMethod(methodName, javaParamsClass, function(err, method) {
        if (err) {
          console.error(err);
          self.emit("error", err);
          return;
        }
        method.setAccessible(true, function(err) {
          if (err) {
            console.error(err);
            self.emit("error", err);
            return;
          }
          callback(method);
        });
      });
    });
  }

  function invoke(obj, method, params, callback) {
    var data = method.invoke(obj, params, function(err, result) {
      if (err) {
        console.error(err);
        self.emit("error", err);
        return;
      }
      callback(result);
    });
  }

  getMethod(obj, methodName, paramsClass, function(method) {
    invoke(obj, method, params, function(data) {
      callback(data);
    });
  });
}

