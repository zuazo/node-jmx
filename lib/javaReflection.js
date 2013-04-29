var java = require('java'),
    Method = java.import("java.lang.reflect.Method");

function getMethod(obj, methodName, paramsClass, callback) {
  var javaParamsClass = newClassArray(paramsClass);
  var method = obj.getClassSync().getMethodSync(methodName, javaParamsClass);
  method.setAccessibleSync(true);
  callback(method);
}

function invoke(obj, method, params, callback) {
  var data = method.invokeSync(obj, params);
  callback(data);
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

