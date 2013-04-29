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

// we need reflection to call setAccessible() and avoid the Reflection.ensureMemberAccess exception
JavaJmx.prototype.read = function(mbean, attributeName, callback) {
  var self = this;
  this.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    var method = "getAttribute";
    var paramsClass = [ "javax.management.ObjectName", "java.lang.String" ];
    var params = [instance.getObjectNameSync(), attributeName];
    javaReflection.invokeMethod(self.mbeanServerConnection.getConnection(), method, paramsClass, params, function(attrObject) {
      callback(attrObject);
    });
  });
}

JavaJmx.prototype.write = function(mbean, attributeName, value, callback) {
  var self = this;
  var attribute = java.newInstanceSync("javax.management.Attribute", attributeName, value);
  this.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    var method = "setAttribute";
    var paramsClass = [ "javax.management.ObjectName", "javax.management.Attribute" ];
    var params = [instance.getObjectNameSync(), attribute];
    javaReflection.invokeMethod(self.mbeanServerConnection.getConnection(), method, paramsClass, params, function(attrObject) {
      callback(attrObject);
    });
  });
}

