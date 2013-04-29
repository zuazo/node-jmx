var java = require('java'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    JavaJmx = require('./java/javaJmx');

java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");

module.exports = Client;

function Client(serviceOrHost, port, protocol, urlPath) {
  EventEmitter.call(this);
  this.jmxConnector = null
  this.mbeanServerConnection = null
  this.javaJmx = new JavaJmx();
  this.jmxServiceUrl = this.javaJmx.JmxServiceUrl(serviceOrHost, port, protocol, urlPath);
}
util.inherits(Client, EventEmitter);

Client.prototype.read = function(mbean, attribute, callback) {
  this.javaJmx.connect(this.jmxServiceUrl);
  this.javaJmx.read(mbean, attribute, callback);
}

Client.prototype.write = function(mbean, attribute, value, callback) {
  this.javaJmx.connect(this.jmxServiceUrl);
  this.javaJmx.write(mbean, attribute, value, callback);
}

Client.prototype.close = function(callback) {
  this.javaJmx.disconnect();
}

