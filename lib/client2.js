var Client = require("./client")

{
  let tmp = Client.prototype.connect
  Client.prototype.connect = tmp
}

{
  let tmp = Client.prototype.disconnect
  Client.prototype.disconnect = tmp
}

{
  let tmp = Client.prototype.getAttributes
  Client.prototype.getAttributes = function(mbean, attributes) {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [mbean, attributes, resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.getAttribute
  Client.prototype.getAttribute = function(mbean, attributes) {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [mbean, attributes, resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.queryNamesWithObjectName
  Client.prototype.queryNamesWithObjectName = function(attribute) {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [attribute, resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

// TODO:
{
  let tmp = Client.prototype.getDefaultDomain
  Client.prototype.getDefaultDomain = function() {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.getDomains
  Client.prototype.getDomains = function() {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.getMBeanCount
  Client.prototype.getMBeanCount = function() {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.invoke
  Client.prototype.invoke = function(mbean, methodName, params, signatureOrCallback) {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [mbean, methodName, params, signatureOrCallback, resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.listMBeans
  Client.prototype.listMBeans = function() {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}

{
  let tmp = Client.prototype.setAttribute
  Client.prototype.setAttribute = function(mbean, attribute, value, classNameOrCallback) {
    return new Promise((resolve, reject) => {
      try {
        tmp.apply(this, [mbean, attribute, value, classNameOrCallback, resolve])
      } catch (e) {
        reject(e)
      }
    })
  }
}


module.exports = Client;
