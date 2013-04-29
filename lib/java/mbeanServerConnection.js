var java = require('java'),
    util = require('util'),
    javaRemote = require('./javaRemote'),
    javaReflection = require('./javaReflection');

module.exports = MBeanServerConnection;

function MBeanServerConnection(jmxServiceUrl) {
  this.jmxConnector = null
  this.mbeanServerConnection = null
  this.jmxServiceUrl = jmxServiceUrl;
}

MBeanServerConnection.prototype.connect = function(jmxServiceUrl) {
  if (jmxServiceUrl) {
    this.jmxServiceUrl = jmxServiceUrl;
  }
  if (this.jmxConnector === null) {
    var map = java.newInstanceSync("java.util.HashMap");
    var JMXConnectorFactory = java.import("javax.management.remote.JMXConnectorFactory");
    this.jmxConnector = JMXConnectorFactory.connectSync(this.jmxServiceUrl, map);
  }
  if (this.mbeanServerConnection == null) {
    this.mbeanServerConnection = this.jmxConnector.getMBeanServerConnectionSync();
  }
}

MBeanServerConnection.prototype.disconnect = function() {
  this.mbeanServerConnection = null;
  if (this.jmxConnector !== null) {
    this.jmxConnector.closeSync();
    this.jmxConnector = null;
  }
}

MBeanServerConnection.prototype.getConnection = function() {
  return this.mbeanServerConnection;
}

MBeanServerConnection.prototype.queryMBeans = function(objName, query, callback) {
  this.mbeanServerConnection.queryMBeans(objName, java.newInstanceSync("javax.management.ObjectName", query), function(err, instances) {
    if (err) {
      console.error(err);
      return;
    }
    instancesAr = instances.toArray(function(err, instancesAr) {
      for (var i = 0, instance = instancesAr[i]; i < instancesAr.length; i++) {
        callback(instance);
      }
    });
  });
}

// we need reflection to call setAccessible() and avoid the Reflection.ensureMemberAccess exception
MBeanServerConnection.prototype.getAttribute = function(name, attribute, callback) {
    var method = "getAttribute";
    var paramsClass = [ "javax.management.ObjectName", "java.lang.String" ];
    var params = [name, attribute];
    javaReflection.invokeMethod(this.mbeanServerConnection, method, paramsClass, params, function(attrObject) {
      callback(attrObject);
    });
}

MBeanServerConnection.prototype.setAttribute = function(name, attribute, callback) {
    var method = "setAttribute";
    var paramsClass = [ "javax.management.ObjectName", "javax.management.Attribute" ];
    var params = [name, attribute];
    javaReflection.invokeMethod(this.mbeanServerConnection, method, paramsClass, params, function() {
      if (callback) callback();
    });
}

