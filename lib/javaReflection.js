var java = require('java'),
    Method = java.import("java.lang.reflect.Method");

function getMethod(obj, methodName, paramsClass, callback) {
  var javaParamsClass = newClassArray(paramsClass);
  obj.getClass(function(err, javaClass) {
    if (err) {
      console.error(err);
      return;
    }
    javaClass.getMethod(methodName, javaParamsClass, function(err, method) {
      if (err) {
        console.error(err);
        return;
      }
      method.setAccessible(true, function(err) {
        if (err) {
          console.error(err);
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
      return;
    }
    callback(result);
  });
}

function invokeMethod(obj, methodName, paramsClass, params, callback) {
  getMethod(obj, methodName, paramsClass, function(method) {
    invoke(obj, method, params, function(data) {
      callback(data);
    });
  });
}

function newClassArray(params) {
  var classArray = [];
  params.forEach(function(value) {
    var javaClass = java.callStaticMethodSync("java.lang.Class", "forName", value);
    classArray.push(javaClass);
  });
  var paramsClass = java.newArray("java.lang.Class", classArray);
  return paramsClass;
}

module.exports = {
  invokeMethod: invokeMethod,
};

