
var INT_MIN = -2147483648;
var INT_MAX = 2147483647;
var UINT_MAX = 4294967295;

function isBoolean(param) {
  return typeof param === "boolean";
}

function isNumber(param) {
  return typeof param === "number";
}

function isInt32(param) {
  return isNumber(param) && param % 1 === 0 && param >= INT_MIN && param <= INT_MAX;
}

function isUInt32(param) {
  return isNumber(param) && param % 1 === 0 && param >= 0 && param <= UINT_MAX;
}

function isString(param) {
  return typeof param === "string";
}

function isObject(param) {
  return typeof param === "object" && typeof param.getClassSync === "function";
}

function isArray(param) {
  return Object.prototype.toString.call(param) === "[object Array]";
}

function v8ToJavaClass(param) {
  if (isString(param)) {
    return "java.lang.String";
  }
  if (isInt32(param) || isUInt32(param)) {
    return "java.lang.Integer";
  }
  if (isNumber(param)) {
    return "java.lang.Double";
  }
  if (isObject(param)) {
    return param.getClassSync().getName();
  }
  if (isArray(param)) {
    return "java.lang.Object";
  }
  throw "unknown object type";
}

module.exports = {
  v8ToJavaClass: v8ToJavaClass,
};

