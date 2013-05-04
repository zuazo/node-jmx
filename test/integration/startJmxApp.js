var spawn = require("child_process").spawn;

var jmxAppName = "JmxAppExample",
    jmxPort = 3000,
    jmxEnableArgs = [
      "-Dcom.sun.management.jmxremote",
      "-Dcom.sun.management.jmxremote.ssl=false",
      "-Dcom.sun.management.jmxremote.authenticate=false"
    ];

function StartJmxApp(port, done) {
  var self = this;

  function onData(data) {
    if (/> $/.test(data)) {
      done();
    } else {
      console.error(data.toString());
    }
  }

  this.onClose = function() {
    console.log(jmxAppName + " closed.");
  }

  var args = jmxEnableArgs.slice();
  args.push("-Dcom.sun.management.jmxremote.port=" + port);
  args.push(jmxAppName);
  this.jmxApp = spawn("java", args, {
    cwd: __dirname,
    stdio: "pipe"
  });
  this.jmxApp.on("close", function() {
    self.onClose()
  });
  this.jmxApp.stdout.on("data", onData);
  this.jmxApp.stderr.on("data", onData);

};

StartJmxApp.prototype.stop = function(callback) {
  this.onClose = callback;
  this.jmxApp.stdin.write("exit\n");
}

module.exports = StartJmxApp;

