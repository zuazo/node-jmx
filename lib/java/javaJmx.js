var java = require('java'),
    jmxServiceUrlBuilder = require('./adapters/helpers/jmxServiceUrlBuilder'),
    MBeanServerConnection = require('./adapters/mbeanServerConnection'),
    conversions = require('./adapters/helpers/conversions');

module.exports = JavaJmx;

function JavaJmx(serviceOrHost, port, protocol, urlPath) {
  this.jmxConnector = null
  this.mbeanServerConnection = new MBeanServerConnection();
}

JavaJmx.prototype.JmxServiceUrl = function(serviceOrHost, port, protocol, urlPath) {
  return jmxServiceUrlBuilder(serviceOrHost, port, protocol, urlPath);
}

JavaJmx.prototype.connect = function(jmxServiceUrl, callback) {
  this.mbeanServerConnection.connect(jmxServiceUrl, callback);
}

JavaJmx.prototype.disconnect = function() {
  this.mbeanServerConnection.close();
}

JavaJmx.prototype.getAttribute = function(mbean, attributeName, callback) {
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

JavaJmx.prototype.setAttribute = function(mbean, attributeName, value, callback) {
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
      signature.push(conversions.v8ToJavaClass(param));
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

