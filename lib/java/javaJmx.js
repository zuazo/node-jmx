var java = require('java'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    javaRemote = require('./javaRemote'),
    javaReflection = require('./javaReflection'),
    MBeanServerConnection = require('./mbeanServerConnection');

module.exports = JavaJmx;

function JavaJmx(serviceOrHost, port, protocol, urlPath) {
  EventEmitter.call(this);
  this.jmxConnector = null
  this.mbeanServerConnection = new MBeanServerConnection();
}
util.inherits(JavaJmx, EventEmitter);

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
    self.mbeanServerConnection.getAttribute(instance.getObjectNameSync(), attributeName, function(attrObject) {
      callback(attrObject);
    });
  });
}

JavaJmx.prototype.write = function(mbean, attributeName, value, callback) {
  var self = this;
  var attribute = java.newInstanceSync("javax.management.Attribute", attributeName, value);
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    self.mbeanServerConnection.setAttribute(instance.getObjectNameSync(), attribute, function() {
      if (callback) callback();
    });
  });
}

