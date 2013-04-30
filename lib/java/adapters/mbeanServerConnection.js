var java = require('java'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    javaReflection = require('./helpers/javaReflection'),
    JMXConnectorFactory = java.import("javax.management.remote.JMXConnectorFactory");

module.exports = MBeanServerConnection;

function MBeanServerConnection(jmxServiceUrl) {
  EventEmitter.call(this);

  this.jmxConnector = null
  this.mbeanServerConnection = null
  this.jmxServiceUrl = jmxServiceUrl;
}
util.inherits(MBeanServerConnection, EventEmitter);

MBeanServerConnection.prototype.connect = function(jmxServiceUrl) {
  function GetMBeanServerConnection() {
    var self = this;
    if (self.mbeanServerConnection === null) {
      self.jmxConnector.getMBeanServerConnection(function(err, mbeanServerConnection) {
        if (err) {
          console.error(err);
          self.emit("error", err);
          return;
        }
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
      if (err) {
        console.error(err);
        self.emit("error", err);
        return;
      }
      JMXConnectorFactory.connect(self.jmxServiceUrl, map, function(err, jmxConnector) {
        if (err) {
          console.error(err);
          self.emit("error", err);
          return;
        }
        self.jmxConnector = jmxConnector;
        GetMBeanServerConnection.call(self);
      });
    });
  } else {
    GetMBeanServerConnection.call(self);
  }
}

MBeanServerConnection.prototype.close = function() {
  this.mbeanServerConnection = null;
  if (this.jmxConnector !== null) {
    this.jmxConnector.close(function(err) {
      if (err) {
        console.error(err);
        self.emit("error", err);
        return;
      }
      this.emit("disconnect");
    });
    this.jmxConnector = null;
  }
}

MBeanServerConnection.prototype.queryMBeans = function(objName, query, callback) {
  var self = this;
  java.newInstance("javax.management.ObjectName", query, function(err, queryObject) {
    if (err) {
      console.error(err);
      self.emit("error", err);
      return;
    }
    self.mbeanServerConnection.queryMBeans(objName, queryObject, function(err, instances) {
      if (err) {
        console.error(err);
        self.emit("error", err);
        return;
      }
      instancesAr = instances.toArray(function(err, instancesAr) {
        if (err) {
          console.error(err);
          self.emit("error", err);
          return;
        }
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
  javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function(attrObject) {
    if (callback) callback(attrObject);
  });
}

MBeanServerConnection.prototype.setAttribute = function(name, attribute, callback) {
  var method = "setAttribute";
  var methodParamsClass = [ "javax.management.ObjectName", "javax.management.Attribute" ];
  var methodParams = [ name, attribute ];
  javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function() {
    if (callback) callback();
  });
}

MBeanServerConnection.prototype.invoke = function(name, operationName, params, signature, callback) {
  var method = "invoke";

  var paramsArray = java.newArray("java.lang.Object", params);
  var signatureArray = java.newArray("java.lang.String", signature);

  var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String", "[Ljava.lang.Object;", "[Ljava.lang.String;" ];
  var methodParams = [ name, operationName, paramsArray, signatureArray ];
  javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function(data) {
    if (callback) callback(data);
  });
}

