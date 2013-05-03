var util = require("util");

var DEBUG_MAX_LENGTH = 1000;

var debug;
if (process.env.NODE_DEBUG && /(jmx|node-jmx)/.test(process.env.NODE_DEBUG)) {
  var pid = process.pid;
  debug = function(x) {
    // if console is not set up yet, then skip this.
    if (!console.error)
      return;
    console.error("JMX: %d", pid,
                  util.format.apply(util, arguments).slice(0, DEBUG_MAX_LENGTH));
  };
} else {
  debug = function() { };
}

function checkError(err, obj) {
  if (err) {
    debug("ERROR " + err);
    if (typeof obj === "object") {
      obj.emit("error", err);
    } else {
      throw Error(err);
    }
    return true;
  }
  return false;
}

module.exports = {
  checkError: checkError,
  debug: debug
};

