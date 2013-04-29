var java = require('java'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    javaRemote = require('./javaRemote');

module.exports = JavaJmx;

function JavaJmx(serviceOrHost, port, protocol, urlPath) {
  EventEmitter.call(this);
  this.jmxConnector = null
  this.mbeanServerConnection = null
}
util.inherits(JavaJmx, EventEmitter);

JavaJmx.prototype.JmxServiceUrl = function(serviceOrHost, port, protocol, urlPath) {
  return javaRemote.JMXServiceURL(serviceOrHost, port, protocol, urlPath);
}

JavaJmx.prototype.connect = function(jmxServiceUrl) {
  if (this.jmxConnector === null) {
    var map = java.newInstanceSync("java.util.HashMap");
    var JMXConnectorFactory = java.import("javax.management.remote.JMXConnectorFactory");
    this.jmxConnector = JMXConnectorFactory.connectSync(jmxServiceUrl, map);
  }
  if (this.mbeanServerConnection == null) {
    this.mbeanServerConnection = this.jmxConnector.getMBeanServerConnectionSync();
  }
}

JavaJmx.prototype.disconnect = function() {
  this.mbeanServerConnection = null;
  if (this.jmxConnector !== null) {
    this.jmxConnector.closeSync();
    this.jmxConnector = null;
  }
}

JavaJmx.prototype.read = function(mbean, attribute, callback) {
  var instances = this.mbeanServerConnection.queryMBeansSync(null, java.newInstanceSync("javax.management.ObjectName", mbean));
  instancesAr = instances.toArraySync();
  for (var i = 0, instance = instancesAr[i]; i < instancesAr.length; i++) {
    var objectName = instance.getObjectNameSync();

    // Without Reflection
    // var attrObject = this.mbeanServerConnection.getAttributeSync(objectName, attribute);

    // we need reflection to call setAccessible() and avoid the Reflection.ensureMemberAccess exception

    // With Reflection
    var Method = java.import("java.lang.reflect.Method");
    var objectNameClass = java.callStaticMethodSync("java.lang.Class", "forName", "javax.management.ObjectName");
    var StringClass = java.callStaticMethodSync("java.lang.Class", "forName", "java.lang.String");
    var params = java.newArray("java.lang.Class", [ objectNameClass, StringClass]);
    var method = this.mbeanServerConnection.getClassSync().getMethodSync("getAttribute", params);
    method.setAccessibleSync(true);
    var attrObject = method.invokeSync(this.mbeanServerConnection, [instance.getObjectNameSync(), attribute]);
    callback(attrObject);
  }
}

