var JavaJmx = require('./java/javaJmx');

module.exports = Client;

function Client(serviceOrHost, port, protocol, urlPath) {
  this.javaJmx = new JavaJmx();
  this.jmxServiceUrl = this.javaJmx.JmxServiceUrl(serviceOrHost, port, protocol, urlPath);
}

Client.prototype.connect = function(callback) {
  this.javaJmx.connect(this.jmxServiceUrl, callback);
}

Client.prototype.getAttribute = function(mbean, attribute, callback) {
  this.javaJmx.getAttribute(mbean, attribute, callback);
}

Client.prototype.setAttribute = function(mbean, attribute, value, callback) {
  this.javaJmx.setAttribute(mbean, attribute, value, callback);
}

Client.prototype.invoke = function(mbean, methodName, params, signatureOrCallback, callback) {
  this.javaJmx.invoke(mbean, methodName, params, signatureOrCallback, callback);
}

Client.prototype.close = function(callback) {
  this.javaJmx.disconnect();
}

