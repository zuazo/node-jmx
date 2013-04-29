var JavaJmx = require('./java/javaJmx');

module.exports = Client;

function Client(serviceOrHost, port, protocol, urlPath) {
  this.javaJmx = new JavaJmx();
  this.jmxServiceUrl = this.javaJmx.JmxServiceUrl(serviceOrHost, port, protocol, urlPath);
}

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

