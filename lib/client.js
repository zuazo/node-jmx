var JavaJmx = require("./javaJmx"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;

function Client(serviceOrHost, port, protocol, urlPath, username, password) {
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
  self.username = username;
  self.password = password;
}
util.inherits(Client, EventEmitter);

Client.prototype.connect = function() {
  this.javaJmx.setCredentials(this.username, this.password);
  this.javaJmx.connect(this.jmxServiceUrl);
};

Client.prototype.disconnect = function() {
  this.javaJmx.disconnect();
};

// ISSUE-6 / EMB - Added getAttributes function
Client.prototype.getAttributes = function(mbean, attributes, callback) {
  this.javaJmx.getAttributes(mbean, attributes, callback);
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

Client.prototype.invoke = function(mbean, methodName, params, signatureOrCallback, callback) {
  this.javaJmx.invoke(mbean, methodName, params, signatureOrCallback, callback);
};

Client.prototype.listMBeans = function(callback) {
  this.javaJmx.listMBeans(callback);
};

Client.prototype.setAttribute = function(mbean, attribute, value, classNameOrCallback, callback) {
  this.javaJmx.setAttribute(mbean, attribute, value, classNameOrCallback, callback);
};

module.exports = Client;

