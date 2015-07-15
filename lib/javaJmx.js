var java = require("java"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    checkError = require("./helpers/error").checkError,
    jmxServiceUrlBuilder = require("./adapters/helpers/jmxServiceUrlBuilder"),
    MBeanServerConnection = require("./adapters/mbeanServerConnection"),
    conversions = require("./adapters/helpers/conversions");

function JavaJmx(serviceOrHost, port, protocol, urlPath) {
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
      if (/java\.net\.ConnectException: Connection refused/.test(err)) {
        self.mbeanServerConnection.close();
      }
    });
  }

  EventEmitter.call(this);

  this.mbeanServerConnection = new MBeanServerConnection();
  subscribeTo(this.mbeanServerConnection);
}
util.inherits(JavaJmx, EventEmitter);

JavaJmx.prototype.JmxServiceUrl = function(serviceOrHost, port, protocol, urlPath) {
  return jmxServiceUrlBuilder(serviceOrHost, port, protocol, urlPath);
};

JavaJmx.prototype.connect = function(jmxServiceUrl) {
  this.mbeanServerConnection.connect(jmxServiceUrl);
};

JavaJmx.prototype.disconnect = function() {
  this.mbeanServerConnection.close();
};

// ISSUE-6 / EMB - Added getAttributes function
JavaJmx.prototype.getAttributes = function(mbean, attributeNames, callback) {

  function attributesArray2js(attributes, callback) {
    var values = [];
    attributes.toArray(function(err, attributesAr) {
      if (checkError(err, self)) return;
      attributesAr.forEach(function(attribute) {
        values.push(attribute.getValueSync());
      });
      callback(values);
    });
  }

  var self = this;
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    instance.getObjectName(function(err, objectName) {
      if (checkError(err, self)) return;
      self.mbeanServerConnection.getAttributes(objectName, attributeNames, function(attributes) {
        attributesArray2js(attributes, callback);
      });
    });
  });
};

JavaJmx.prototype.getAttribute = function(mbean, attributeName, callback) {
  var self = this;
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
    instance.getObjectName(function(err, objectName) {
      if (checkError(err, self)) return;
      self.mbeanServerConnection.getAttribute(objectName, attributeName, callback);
    });
  });
};

JavaJmx.prototype.getDefaultDomain = function(callback) {
  this.mbeanServerConnection.getDefaultDomain(callback);
};

JavaJmx.prototype.getDomains = function(callback) {
  this.mbeanServerConnection.getDomains(callback);
};

JavaJmx.prototype.getMBeanCount = function(callback) {
  this.mbeanServerConnection.getMBeanCount(callback);
};

JavaJmx.prototype.invoke = function(mbean, methodName, params, signatureOrCallback, callback) {

  function generateJavaSignature(params) {
    var self = this;

    var signature = [];
    params.forEach(function(param) {
      try {
        signature.push(conversions.v8ToJavaClass(param));
      } catch(err) {
        checkError(err, self);
      }
    });
    return signature;
  }

  function jsParams2JavaParams(params, signature) {
    var javaParams = [];
    signature.forEach(function(className) {
      var value = params.shift();
      if (typeof value.getClass !== "function") {
        if (!conversions.isJavaPrimitiveClass(className)) {
          // TODO: make this async
          value = java.newInstanceSync(className, value);
        }
      }
      javaParams.push(value);
    });
    return javaParams;
  }

  var self = this;
  var signature;
  params = params || [];
  if (typeof signatureOrCallback === "function") {
    callback = signatureOrCallback;
    signature = generateJavaSignature.call(self, params);
  } else {
    signature = signatureOrCallback || generateJavaSignature.call(self, params);
  }
  var javaParams = jsParams2JavaParams.call(self, params, signature);
  self.mbeanServerConnection.queryMBeans(null, mbean, function(instance, end_callback) {
    instance.getObjectName(function(err, objectName) {
      if (checkError(err, self)) return;
      self.mbeanServerConnection.invoke(objectName, methodName, javaParams, signature, callback);
    });
    end_callback();
  });
};

JavaJmx.prototype.listMBeans = function(callback) {
  var self = this;

  var mbeans = [];
  self.mbeanServerConnection.queryMBeans(null, null, function(instance, end_callback) {
      instance.getObjectName(function(err, objectName) {
        if (checkError(err, self)) { end_callback(); return; }
        objectName.getCanonicalName(function(err, str) {
          if (checkError(err, self)) { end_callback(); return; }
          mbeans.push(str);
          end_callback();
        });
      });
    }, function() {
      callback(mbeans);
  });
};

JavaJmx.prototype.setAttribute = function(mbean, attributeName, value, classNameOrCallback, callback) {
  function setAttribute(mbean, attributeName, value, callback) {
    java.newInstance("javax.management.Attribute", attributeName, value, function(err, attribute) {
      if (checkError(err, self)) return;
      self.mbeanServerConnection.queryMBeans(null, mbean, function(instance) {
        instance.getObjectName(function(err, objectName) {
          if (checkError(err, self)) return;
          self.mbeanServerConnection.setAttribute(objectName, attribute, callback);
        });
      });
    });
  }

  var self = this;

  if (typeof classNameOrCallback === "string" && !conversions.isJavaPrimitiveClass(classNameOrCallback)) {
    var newInstanceArgs = [ classNameOrCallback ];
    newInstanceArgs = newInstanceArgs.concat(value);
    newInstanceArgs.push(function(err, obj) {
      if (checkError(err, self)) return;
      setAttribute.call(self, mbean, attributeName, obj, callback);
    });
    java.newInstance.apply(java, newInstanceArgs);
  } else {
    if (typeof callback === "undefined" && typeof classNameOrCallback === "function") {
      callback = classNameOrCallback;
    }
    setAttribute.call(self, mbean, attributeName, value, callback);
  }
};

JavaJmx.prototype.setCredentials = function(username, password) {
  this.mbeanServerConnection.setCredentials(username, password);
};

module.exports = JavaJmx;

