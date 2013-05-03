var JavaJmx = require("./java/javaJmx"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;

function Client(serviceOrHost, port, protocol, urlPath) {
  var self = this;

  function subscribeTo(obj) {
    obj.on("connect", function() {
      self.emit("connect");
    });
    obj.on("disconnect", function() {
      self.emit("disconnect");
    });
    obj.on("error", function(err) {
      self.emit("error", err);
    });
  }

  EventEmitter.call(self);

  self.javaJmx = new JavaJmx();
  subscribeTo(self.javaJmx);
  self.jmxServiceUrl = this.javaJmx.JmxServiceUrl(serviceOrHost, port, protocol, urlPath);
}
util.inherits(Client, EventEmitter);

Client.prototype.connect = function() {
  this.javaJmx.connect(this.jmxServiceUrl);
};

Client.prototype.getAttribute = function(mbean, attribute, callback) {
  this.javaJmx.getAttribute(mbean, attribute, callback);
};

Client.prototype.getDefaultDomain = function(callback) {
  this.javaJmx.getDefaultDomain(callback);
};

Client.prototype.getDomains = function(callback) {
  this.javaJmx.getDomains(callback);
};

Client.prototype.getMBeanCount = function(callback) {
  this.javaJmx.getMBeanCount(callback);
};

Client.prototype.setAttribute = function(mbean, attribute, value, callback) {
  this.javaJmx.setAttribute(mbean, attribute, value, callback);
};

Client.prototype.invoke = function(mbean, methodName, params, signatureOrCallback, callback) {
  this.javaJmx.invoke(mbean, methodName, params, signatureOrCallback, callback);
};

Client.prototype.disconnect = function() {
  this.javaJmx.disconnect();
};

module.exports = Client;

