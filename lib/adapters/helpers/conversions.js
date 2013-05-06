
var INT_MIN = -2147483648;
var INT_MAX = 2147483647;
var UINT_MAX = 4294967295;

function isBoolean(param) {
  return typeof param === "boolean";
}

function isInteger(param) {
  return typeof param === "object" && typeof param.intValue !== "undefined";
}

function isLong(param) {
  return typeof param === "object" && typeof param.longValue !== "undefined";
}

function isFloat(param) {
  return typeof param === "object" && typeof param.floatValue !== "undefined";
}

function isDouble(param) {
  return typeof param === "object" && typeof param.doubleValue !== "undefined";
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

function isByte(param) {
  return typeof param === "object" && typeof param.byteValue !== "undefined";
}

function isString(param) {
  return typeof param === "string";
}

function isJavaObject(param) {
  return typeof param === "object" && typeof param.getClassSync === "function";
}

function isArray(param) {
  return Object.prototype.toString.call(param) === "[object Array]";
}

function isJavaPrimitiveClass(className) {
  switch (className) {
    case "byte":
    case "short":
    case "int":
    case "long":
    case "float":
    case "double":
    case "boolean":
    case "char":
      return true;
    default:
      return false;
  }
}

function v8ToJavaClass(param) {
  if (isString(param)) {
    return "java.lang.String";
  }
  if (isLong(param)) {
    return "long";
  }
  if (isBoolean(param)) {
    return "boolean";
  }
  if (isInteger(param) || isInt32(param) || isUInt32(param)) {
    return "int";
  }
  if (isFloat(param)) {
    return "float";
  }
  if (isNumber(param) || isDouble(param)) {
    return "double";
  }
  if (isByte(param)) {
    return "byte";
  }
  if (isJavaObject(param)) {
    // TODO: this must be done async
    return param.getClassSync().getNameSync();
  }
  if (isArray(param)) {
    return "java.lang.Object";
  }
  throw Error("v8ToJavaClass(): unknown object type (" + typeof param + ")");
}

module.exports = {
  isJavaPrimitiveClass: isJavaPrimitiveClass,
  v8ToJavaClass: v8ToJavaClass
};

