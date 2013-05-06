var spawn = require("child_process").spawn;

var jmxAppName = "JmxAppExample",
    jmxPort = 3000,
    jmxEnableArgs = [
      "-Dcom.sun.management.jmxremote",
      "-Dcom.sun.management.jmxremote.ssl=false"
    ];

function StartJmxApp(port, password_file, done) {
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
  if (password_file) {
    args.push("-Dcom.sun.management.jmxremote.password.file=" + password_file);
    args.push("-Dcom.sun.management.jmxremote.authenticate=true");
  } else {
    args.push("-Dcom.sun.management.jmxremote.authenticate=false");
  }
  args.push(jmxAppName);
  this.jmxApp = spawn("java", args, {
    cwd: __dirname,
    stdio: "pipe"
  });
  this.jmxApp.on("close", function() {
    self.onClose();
    self.jmxApp = null;
  });
  this.jmxApp.stdout.on("data", onData);
  this.jmxApp.stderr.on("data", onData);

};

StartJmxApp.prototype.stop = function(callback) {
  if (this.jmxApp) {
    this.onClose = callback || new Function();
    this.jmxApp.stdin.write("exit\n");
  } else {
    callback();
  }
}

module.exports = StartJmxApp;

