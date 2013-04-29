var java = require('java'),
    javaRemote = require('./javaRemote'),
    MBeanServerConnection = require('./mbeanServerConnection'),
    javaHelpers = require('./javaHelpers');

module.exports = JavaJmx;

function JavaJmx(serviceOrHost, port, protocol, urlPath) {
  this.jmxConnector = null
  this.mbeanServerConnection = new MBeanServerConnection();
}

JavaJmx.prototype.JmxServiceUrl = function(serviceOrHost, port, protocol, urlPath) {
  return javaRemote.JMXServiceURL(serviceOrHost, port, protocol, urlPath);
}

JavaJmx.prototype.connect = function(jmxServiceUrl) {
  this.mbeanServerConnection.connect(jmxServiceUrl);
}

JavaJmx.prototype.disconnect = function() {
  this.mbeanServerConnection.disconnect();
}

JavaJmx.prototype.read = function(mbean, attributeName, callback) {
  var self = this;
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    instance.getObjectName(function(err, objectName) {
      if (err) {
        console.error(err);
        return;
      }
      self.mbeanServerConnection.getAttribute(objectName, attributeName, function(attrObject) {
        callback(attrObject);
      });
    });
  });
}

JavaJmx.prototype.write = function(mbean, attributeName, value, callback) {
  var self = this;
  java.newInstance("javax.management.Attribute", attributeName, value, function(err, attribute) {
    if (err) {
      console.error(err);
      return;
    }
    self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
      instance.getObjectName(function(err, objectName) {
        if (err) {
          console.error(err);
          return;
        }
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
      signature.push(javaHelpers.v8ToJavaClass(param));
    });
  } else {
    signature = signatureOrCallback;
  }
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    instance.getObjectName(function(err, objectName) {
      self.mbeanServerConnection.invoke(objectName, methodName, params, signature, function(result) {
        callback(result);
      });
    });
  });
}

