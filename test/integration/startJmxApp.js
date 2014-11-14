var spawn = require("child_process").spawn,
    exec = require("child_process").exec,
    JAVA_HOME = process.env.JAVA_HOME;

var jmxAppName = "JmxAppExample",
    jmxPort = 3000,
    jmxEnableArgs = [
      "-Dcom.sun.management.jmxremote",
      "-Dcom.sun.management.jmxremote.ssl=false"
    ];

var java_bin;
if (JAVA_HOME) {
  java_bin = JAVA_HOME + "/bin/java";
} else {
  java_bin = "java";
}

function StartJmxApp(port, password_file, done) {
  var self = this;

  function onData(data) {
    if (/> $/.test(data)) {
      done();
    }
  }

  function onDataError(data) {
    console.error(data.toString());
  }

  this.onClose = function() {
    console.log(jmxAppName + " closed.");
  };

  var args = jmxEnableArgs.slice();
  args.push("-Dcom.sun.management.jmxremote.port=" + port);
  if (password_file) {
    args.push("-Dcom.sun.management.jmxremote.password.file=" + password_file);
    args.push("-Dcom.sun.management.jmxremote.authenticate=true");
  } else {
    args.push("-Dcom.sun.management.jmxremote.authenticate=false");
  }
  args.push(jmxAppName);
  this.jmxApp = spawn(java_bin, args, {
    cwd: __dirname,
    stdio: "pipe"
  });
  this.jmxApp.on("exit", function() {
    self.onClose();
    self.jmxApp = null;
  });
  this.jmxApp.stdout.on("data", onData);
  this.jmxApp.stderr.on("data", onDataError);

}

StartJmxApp.getJavaVersion = function(callback) {
  exec(java_bin + " -version", function (error, stdout, stderr) {
    if (error !== null) {
      console.error("getJavaVersion() error: " + error);
    } else if (stderr && stderr.length > 0) {
      callback(stderr);
    } else {
      console.error("getJavaVersion(): error running `java -version`, check if you have java correctly installed");
    }
  });
};

StartJmxApp.prototype.stop = function(callback) {
  if (this.jmxApp) {
    this.onClose = callback || function() {};
    this.jmxApp.stdin.write("exit\n");
  } else {
    callback();
  }
};

module.exports = StartJmxApp;

