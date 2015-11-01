var assert = require("assert"),
    async = require("async"),
    chmod = require("fs").chmod,
    jmx = require("./../index.js"),
    StartJmxApp = require("./integration/startJmxApp.js");

var jmxPort = 63120;

describe("Integration tests", function() {
  this.timeout(5000);
  before(function(done) {

    if (!process.env.JMX_COVERAGE) {
      console.log("    Node.js version: " + process.version);
    }
    StartJmxApp.getJavaVersion(function(java_version) {
      if (!process.env.JMX_COVERAGE) {
        console.log("    Java version:");
        console.log(java_version.replace(/^/mg, "        "));
      }
      chmod(__dirname + "/integration/jmxremote.password", 0400, function(err) {
        if (err) {
          console.error(err);
        }
        done();
      });
    });
  });

  it("runs java JMX test app", function(done) {
    var jmxApp = new StartJmxApp(jmxPort, null, function() {
      jmxApp.stop(done);
    });
  });

  describe("client", function() {
    var jmxApp;
    before(function(done) {
      jmxApp = new StartJmxApp(jmxPort, null, done);
    });
    after(function(done) {
      jmxApp.stop(done);
    });

    it("connects successfully", function(done) {
      var client = jmx.createClient({
        host: "127.0.0.1",
        port: jmxPort
      });
      client.connect();
      client.on("connect", done);
    });

    it("disconnects successfully", function(done) {
      var client = jmx.createClient({
        host: "127.0.0.1",
        port: jmxPort
      });
      client.connect();
      client.on("connect", client.disconnect);
      client.on("disconnect", done);
    });

    it("works with multiple clients", function(done) {
      var clients = [
        jmx.createClient({ host: "127.0.0.1", port: jmxPort }),
        jmx.createClient({ host: "127.0.0.1", port: jmxPort })
      ];
      async.each(clients, function(client, cb) {
        client.connect();
        client.on("connect", function() {
          client.invoke("com.example.test:type=JmxAppExample", "callVoidMethod", [], function(data) {
            client.disconnect();
            cb();
          });
        });
      }, done);
    });

    it("works when disconnecting prematurely", function(done) {
      var client = jmx.createClient({
        host: "127.0.0.1",
        port: jmxPort
      });
      client.connect();
      client.on("error", function(err) {
        if (/Premature disconnect/.test(err)) {
          done();
        } else {
          console.error(err);
        }
      });
      client.on("connect", function() {
        client.invoke("com.example.test:type=JmxAppExample", "callVoidMethod", [], function(data) {});
        client.disconnect();
      });
    });

    it("does not connect when the port is wrong", function(done) {
      this.timeout(20000);
      var client = jmx.createClient({
        host: "127.0.0.1",
        port: jmxPort + 1
      });
      client.connect();
      client.on("error", function(err) {
        if (/java\.(net\.ConnectException|rmi\.ConnectIOException)/.test(err)) {
          done();
        } else {
          console.error(err);
        }
      });
    });

    describe("when it is connected", function() {
      var client;
      before(function(done) {
        client = jmx.createClient({
          host: "127.0.0.1",
          port: jmxPort
        });
        client.connect();
        client.on("connect", done);
      });
      after(function() {
        client.disconnect();
      });

      it("#getAttributes", function(done) {
        client.getAttributes("com.example.test:type=JmxAppExample", [ "LongAttr", "LongAttr" ], function(values) {
          values.forEach(function(value) {
            assert.ok(typeof value === "object" && typeof value.longValue === "string");
          });
          done();
        });
      });

      it("#getAttribute", function(done) {
        client.getAttribute("com.example.test:type=JmxAppExample", "LongAttr", function(value) {
          assert.ok(typeof value === "object" && typeof value.longValue === "string");
          done();
        });
      });

      it("#getDefaultDomain", function(done) {
        client.getDefaultDomain(function(value) {
          assert.ok(typeof value === "string");
          done();
        });
      });

      it("#getDomains", function(done) {
        client.getDomains(function(value) {
          assert.ok(value instanceof Array && value.length > 0);
          done();
        });
      });

      it("#getMBeanCount", function(done) {
        client.getMBeanCount(function(value) {
          assert.ok(typeof value === "number" && value > 0);
          done();
        });
      });

      it("#listMBeans", function(done) {
        function arrayContains(arr, value) {
          for (var k in arr) {
            if (arr[k] == value) return true;
          }
          return false;
        }

        client.listMBeans(function(mbeans) {
          assert.ok(arrayContains(mbeans, "com.example.test:type=JmxAppExample"));
          done();
        });
      });

      describe("#invoke", function() {
        it("invokes a method", function(done) {
          client.invoke("com.example.test:type=JmxAppExample", "callVoidMethod", [], function(data) {
            done();
          });
        });

        it("invokes a method with simple args", function(done) {
          client.invoke("com.example.test:type=JmxAppExample", "callVoidWithSimpleArgs", [ "hello" ], function(data) {
            done();
          });
        });

        it("invokes a method with complex args using className", function(done) {
          var values = [ 1, 5, 22];
          var classNames = [ "long", "int", "java.lang.Long" ];
          client.invoke("com.example.test:type=JmxAppExample", "callVoidWithMixedArguments", values, classNames, function(data) {
            done();
          });
        });

        it("returns long values correctly", function(done) {
          client.invoke("com.example.test:type=JmxAppExample", "callLongWithSimpleArgs", [], function(data) {
            assert.ok(typeof data.longValue === "string");
            done();
          });
        });

        it("returns java.lang.Long values correctly", function(done) {
          client.invoke("com.example.test:type=JmxAppExample", "callLongObjWithSimpleArgs", [], function(data) {
            assert.ok(typeof data.longValue === "string");
            done();
          });
        });

      });

      describe("#setAttribute", function() {

        it("sets a simple string value", function(done) {
          var domain = "com.example.test:type=JmxAppExample";
          var attribute = "StringAttr";
          var values = [ "begin", "end" ];
          client.setAttribute(domain, attribute, values[0], function() {
            client.getAttribute(domain, attribute, function(data) {
              assert.strictEqual(data, values[0]);
              client.setAttribute(domain, attribute, values[1], function() {
                client.getAttribute(domain, attribute, function(data) {
                  assert.strictEqual(data, values[1]);
                  done();
                });
              });
            });
          });
        });

        it("accepts String object values", function(done) {
          client.setAttribute("com.example.test:type=JmxAppExample", "StringAttr", "test", "java.lang.String", function() {
            done();
          });
        });

        it("sets long values", function(done) {
          client.setAttribute("com.example.test:type=JmxAppExample", "LongAttr", 22, function() {
            done();
          });
        });

        it("sets java.lang.Long values using className", function(done) {
          client.setAttribute("com.example.test:type=JmxAppExample", "LongObjAttr", 33, "java.lang.Long", function() {
            done();
          });
        });

      });

    });

  });

  it("runs java JMX test app with authentication enabled", function(done) {
    var jmxApp = new StartJmxApp(jmxPort, "jmxremote.password", function() {
      jmxApp.stop(function() {
        done();
      });
    });
  });

  describe("starting a server with authentication", function() {
    var jmxApp;
    before(function(done) {
      jmxApp = new StartJmxApp(jmxPort, "jmxremote.password", function() {
        done();
      });
    });
    after(function(done) {
      jmxApp.stop(function() {
        done();
      });
    });

    it("does not connect successfully without credentials", function(done) {
      client = jmx.createClient({
        host: "127.0.0.1",
        port: jmxPort
      });
      client.emit = function(ev, data) {
        if (ev === "error") {
          if (/java\.lang\.SecurityException/.test(data)) {
            done();
          } else {
            console.error(data);
          }
        }
      };
      client.connect();
      client.on("connect", function() {
        assert(false, "connect");
      });
    });

    it("connects successfully with the correct credentials", function(done) {
      client = jmx.createClient({
        host: "127.0.0.1",
        port: jmxPort,
        username: "controlRole",
        password: "testPassword"
      });
      client.connect();
      client.on("connect", done);
    });

  });

  describe("starting a server that will go down", function() {
    var jmxApp, client;
    beforeEach(function(done) {
      jmxApp = new StartJmxApp(jmxPort, null, function() {
        client = jmx.createClient({
          host: "127.0.0.1",
          port: jmxPort
        });
        client.on("error", function() {}); // ignore errors
        client.connect();
        done();
      });
    });
    afterEach(function(done) {
      jmxApp.stop(function() {
        done();
      });
    });

    it("emits disconnect event", function(done) {
      client.on("connect", function() {
        client.getMBeanCount(function(count) {
          client.on("disconnect", done);
          jmxApp.stop(function() {
            client.getMBeanCount(function() {});
          });
        });
      });
    });

  });

});

