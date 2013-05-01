var java = require("java"),
    checkError = require("./../../helpers/error").checkError,
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    JavaReflection = require("./javaReflection"),
    JMXConnectorFactory = java.import("javax.management.remote.JMXConnectorFactory");

module.exports = MBeanServerConnection;

function MBeanServerConnection(jmxServiceUrl) {
  EventEmitter.call(this);

  this.jmxConnector = null
  this.mbeanServerConnection = null
  this.jmxServiceUrl = jmxServiceUrl;
  this.javaReflection = new JavaReflection();
  this.javaReflection.on("error", function(err) {
    self.emit("error", err);
  });
}
util.inherits(MBeanServerConnection, EventEmitter);

MBeanServerConnection.prototype.connect = function(jmxServiceUrl) {
  function GetMBeanServerConnection() {
    var self = this;
    if (self.mbeanServerConnection === null) {
      self.jmxConnector.getMBeanServerConnection(function(err, mbeanServerConnection) {
        if (checkError(err, self)) return;
        self.mbeanServerConnection = mbeanServerConnection;
        self.emit("connect");
      });
    }
  }

  var self = this;

  if (jmxServiceUrl) {
    self.jmxServiceUrl = jmxServiceUrl;
  }
  if (self.jmxConnector === null) {
    java.newInstance("java.util.HashMap", function(err, map) {
      if (checkError(err, self)) return;
      JMXConnectorFactory.connect(self.jmxServiceUrl, map, function(err, jmxConnector) {
        if (checkError(err, self)) return;
        self.jmxConnector = jmxConnector;
        GetMBeanServerConnection.call(self);
      });
    });
  } else {
    GetMBeanServerConnection.call(self);
  }
}

MBeanServerConnection.prototype.close = function() {
  var self = this;

  this.mbeanServerConnection = null;
  if (this.jmxConnector !== null) {
    this.jmxConnector.close(function(err) {
      if (checkError(err, self)) return;
      this.emit("disconnect");
    });
    this.jmxConnector = null;
  }
}

MBeanServerConnection.prototype.queryMBeans = function(objName, query, callback) {
  var self = this;
  java.newInstance("javax.management.ObjectName", query, function(err, queryObject) {
    if (checkError(err, self)) return;
    self.mbeanServerConnection.queryMBeans(objName, queryObject, function(err, instances) {
      if (checkError(err, self)) return;
      instancesAr = instances.toArray(function(err, instancesAr) {
        if (checkError(err, self)) return;
        for (var i = 0, instance = instancesAr[i]; i < instancesAr.length; i++) {
          callback(instance);
        }
      });
    });
  });
}

// we need reflection to call setAccessible() and avoid the Reflection.ensureMemberAccess exception
MBeanServerConnection.prototype.getAttribute = function(name, attribute, callback) {
  var method = "getAttribute";
  var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String" ];
  var methodParams = [ name, attribute ];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
}

MBeanServerConnection.prototype.getDefaultDomain = function(callback) {
  var method = "getDefaultDomain";
  var methodParamsClass = [];
  var methodParams = [];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
}

MBeanServerConnection.prototype.getDomains = function(callback) {
  var method = "getDomains";
  var methodParamsClass = [];
  var methodParams = [];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
}

MBeanServerConnection.prototype.setAttribute = function(name, attribute, callback) {
  var method = "setAttribute";
  var methodParamsClass = [ "javax.management.ObjectName", "javax.management.Attribute" ];
  var methodParams = [ name, attribute ];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function() {
    if (callback) callback();
  });
}

MBeanServerConnection.prototype.invoke = function(name, operationName, params, signature, callback) {
  var method = "invoke";

  var paramsArray = java.newArray("java.lang.Object", params);
  var signatureArray = java.newArray("java.lang.String", signature);

  var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String", "[Ljava.lang.Object;", "[Ljava.lang.String;" ];
  var methodParams = [ name, operationName, paramsArray, signatureArray ];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function(data) {
    if (callback) callback(data);
  });
}

