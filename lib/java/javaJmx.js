var java = require("java"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    checkError = require("./../helpers/error").checkError,
    jmxServiceUrlBuilder = require("./adapters/helpers/jmxServiceUrlBuilder"),
    MBeanServerConnection = require("./adapters/mbeanServerConnection"),
    conversions = require("./adapters/helpers/conversions");

module.exports = JavaJmx;

function JavaJmx(serviceOrHost, port, protocol, urlPath) {
  var self = this;

  function subscribeTo(obj) {
    obj.on("connect", function() {
      self.emit("connect");
    });
    obj.on("close", function() {
      self.emit("disconnect");
    });
    obj.on("error", function(err) {
      self.emit("error", err);
    });
  }

  EventEmitter.call(this);

  this.mbeanServerConnection = new MBeanServerConnection();
  subscribeTo(this.mbeanServerConnection);
}
util.inherits(JavaJmx, EventEmitter);

JavaJmx.prototype.JmxServiceUrl = function(serviceOrHost, port, protocol, urlPath) {
  try {
    return jmxServiceUrlBuilder(serviceOrHost, port, protocol, urlPath);
  } catch (err) {
    checkError(err, this);
    return null;
  }
}

JavaJmx.prototype.connect = function(jmxServiceUrl) {
  this.mbeanServerConnection.connect(jmxServiceUrl);
}

JavaJmx.prototype.disconnect = function() {
  this.mbeanServerConnection.close();
}

JavaJmx.prototype.getAttribute = function(mbean, attributeName, callback) {
  var self = this;
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    instance.getObjectName(function(err, objectName) {
      if (checkError(err, self)) return;
      self.mbeanServerConnection.getAttribute(objectName, attributeName, function(attrObject) {
        callback(attrObject);
      });
    });
  });
}

JavaJmx.prototype.setAttribute = function(mbean, attributeName, value, callback) {
  var self = this;
  java.newInstance("javax.management.Attribute", attributeName, value, function(err, attribute) {
    if (checkError(err, self)) return;
    self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
      instance.getObjectName(function(err, objectName) {
        if (checkError(err, self)) return;
        self.mbeanServerConnection.setAttribute(objectName, attribute, function() {
          if (callback) callback();
        });
      });
    });
  });
}

JavaJmx.prototype.invoke = function(mbean, methodName, params, signatureOrCallback, callback) {
  var self = this;
  var signature;
  params = params || [];
  if (typeof callback === "undefined") {
    callback = signatureOrCallback;
    signature = [];
    params.forEach(function(param) {
      try {
        signature.push(conversions.v8ToJavaClass(param));
      } catch(err) {
        checkError(err, self);
      }
    });
  } else {
    signature = signatureOrCallback;
  }
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    instance.getObjectName(function(err, objectName) {
      if (checkError(err, self)) return;
      self.mbeanServerConnection.invoke(objectName, methodName, params, signature, function(result) {
        callback(result);
      });
    });
  });
}

