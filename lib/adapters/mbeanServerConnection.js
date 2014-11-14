var java = require("java"),
    checkError = require("./../helpers/error").checkError,
    async = require("async"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    JavaReflection = require("./javaReflection");

function MBeanServerConnection(jmxServiceUrl) {
  var self = this;
  EventEmitter.call(this);

  self.jmxConnector = null;
  self.mbeanServerConnection = null;
  self.jmxServiceUrl = jmxServiceUrl;
  self.JMXConnectorFactory = java.import("javax.management.remote.JMXConnectorFactory");
  self.javaReflection = new JavaReflection();
  self.javaReflection.on("error", function(err) {
    self.emit("error", err);
  });
}
util.inherits(MBeanServerConnection, EventEmitter);

MBeanServerConnection.prototype.close = function() {
  var self = this;

  self.mbeanServerConnection = null;
  if (self.jmxConnector !== null) {
    self.jmxConnector.close(function(err) {
      self.emit("disconnect");
      checkError(err, self);
    });
    self.jmxConnector = null;
  }
};

MBeanServerConnection.prototype.connect = function(jmxServiceUrl) {

  function GetCredentials(callback) {
    var self = this;
    var credentials = java.newArray("java.lang.String", [ self.username, self.password ]);
    java.newInstance("java.util.HashMap", function(err, map) {
      if (checkError(err, self)) { return; }
      if (typeof self.username === "string" && typeof self.password  === "string") {
        var JMXConnector = java.import("javax.management.remote.JMXConnector");
        map.put(JMXConnector.CREDENTIALS, credentials, function(err) {
          if (checkError(err, self)) { return; }
          callback(map);
        });
      } else {
        callback(map);
      }
    });
  }

  function GetMBeanServerConnection() {
    var self = this;
    if (self.mbeanServerConnection === null) {
      self.jmxConnector.getMBeanServerConnection(function(err, mbeanServerConnection) {
        if (checkError(err, self)) { return; }
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
    GetCredentials.call(self, function(credentials) {
      self.JMXConnectorFactory.connect(self.jmxServiceUrl, credentials, function(err, jmxConnector) {
        if (checkError(err, self)) { return; }
        self.jmxConnector = jmxConnector;
        GetMBeanServerConnection.call(self);
      });
    });
  } else {
    GetMBeanServerConnection.call(self);
  }
};

// we need reflection to call setAccessible() and avoid the Reflection.ensureMemberAccess exception
MBeanServerConnection.prototype.getAttribute = function(name, attribute, callback) {
  var method = "getAttribute";
  var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String" ];
  var methodParams = [ name, attribute ];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
};

MBeanServerConnection.prototype.getDefaultDomain = function(callback) {
  var method = "getDefaultDomain";
  var methodParamsClass = [];
  var methodParams = [];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
};

MBeanServerConnection.prototype.getDomains = function(callback) {
  var method = "getDomains";
  var methodParamsClass = [];
  var methodParams = [];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
};

MBeanServerConnection.prototype.getMBeanCount = function(callback) {
  var method = "getMBeanCount";
  var methodParamsClass = [];
  var methodParams = [];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, callback);
};

MBeanServerConnection.prototype.invoke = function(name, operationName, params, signature, callback) {
  var method = "invoke";

  var paramsArray = java.newArray("java.lang.Object", params);
  var signatureArray = java.newArray("java.lang.String", signature);

  var methodParamsClass = [ "javax.management.ObjectName", "java.lang.String", "[Ljava.lang.Object;", "[Ljava.lang.String;" ];
  var methodParams = [ name, operationName, paramsArray, signatureArray ];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function(data) {
    if (callback) { callback(data); }
  });
};

MBeanServerConnection.prototype.queryMBeans = function(objName, query, callback, end_callback) {

  function createQueryObject(callback) {
    if (query) {
      java.newInstance("javax.management.ObjectName", query, function(err, queryObject) {
        if (checkError(err, self)) { return; }
        callback(queryObject);
      });
    } else {
      callback(query);
    }
  }

  var self = this;
  createQueryObject(function(queryObject) {
    self.mbeanServerConnection.queryMBeans(objName, queryObject, function(err, instances) {
      if (checkError(err, self)) { return; }
      instances.toArray(function(err, instancesAr) {
        if (checkError(err, self)) { return; }
        async.each(instancesAr, callback, function(err) {
          if (checkError(err, self)) { return; }
          if (end_callback) { end_callback(); }
        });
      });
    });
  });
};

MBeanServerConnection.prototype.setAttribute = function(name, attribute, callback) {
  var method = "setAttribute";
  var methodParamsClass = [ "javax.management.ObjectName", "javax.management.Attribute" ];
  var methodParams = [ name, attribute ];
  this.javaReflection.invokeMethod(this.mbeanServerConnection, method, methodParamsClass, methodParams, function() {
    if (callback) { callback(); }
  });
};

MBeanServerConnection.prototype.setCredentials = function(username, password) {
  this.username = username;
  this.password = password;
};

module.exports = MBeanServerConnection;

