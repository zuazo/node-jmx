var assert = require("assert"),
    Client = require("./../lib/client");

describe("Client", function() {

  describe("#Client", function() {

    it("should return a Client object passing the correct arguments", function() {
      var client = new Client("localhost", 3000);
      assert(client instanceof Client, "object");
    });

    it("should throw the correct exception when no argument is passed", function() {
      assert.throws(
        function() {
          new Client()
        },
        "JmxServiceUrlBuilder(): first argument, serviceOrHost, should be a string"
      );
    });
  });

  describe("Methods that should call javaJmx directly and with the correct arguments", function() {
    this.timeout(100);
    var client;
    var method;
    beforeEach(function() {
      client = new Client("localhost", 3000);
    })

    it("#connect", function(done) {
      client.javaJmx.connect = function(jmxServiceUrl, undef) {
        assert.strictEqual(
          jmxServiceUrl.getClassSync().getNameSync(),
          "javax.management.remote.JMXServiceURL"
        );
        assert.strictEqual(undef, undefined);
        done();
      }
      client.connect();
    });

    it("#getAttribute", function(done) {
      client.javaJmx.getAttribute = function(mbean, attribute, callback, undef) {
        assert.strictEqual(mbean, "mbean");
        assert.strictEqual(attribute, "attribute");
        assert.strictEqual(callback, "callback");
        assert.strictEqual(undef, undefined);
        done();
      }
      client.getAttribute("mbean", "attribute", "callback", "defined");
    });

    it("#getDefaultDomain", function(done) {
      client.javaJmx.getDefaultDomain = function(callback, undef) {
        assert.strictEqual(callback, "callback");
        assert.strictEqual(undef, undefined);
        done();
      }
      client.getDefaultDomain("callback", "defined");
    });

    it("#getDomains", function(done) {
      client.javaJmx.getDomains = function(callback, undef) {
        assert.strictEqual(callback, "callback");
        assert.strictEqual(undef, undefined);
        done();
      }
      client.getDomains("callback", "defined");
    });

    it("#getMBeanCount", function(done) {
      client.javaJmx.getMBeanCount = function(callback, undef) {
        assert.strictEqual(callback, "callback");
        assert.strictEqual(undef, undefined);
        done();
      }
      client.getMBeanCount("callback", "defined");
    });

    it("#setAttribute", function(done) {
      client.javaJmx.setAttribute = function(mbean, attribute, value, callback, undef) {
        assert.strictEqual(mbean, "mbean");
        assert.strictEqual(attribute, "attribute");
        assert.strictEqual(value, "value");
        assert.strictEqual(callback, "callback");
        assert.strictEqual(undef, undefined);
        done();
      }
      client.setAttribute("mbean", "attribute", "value", "callback", "defined");
    });

    it("#invoke", function(done) {
      client.javaJmx.invoke = function(mbean, methodName, params, signatureOrCallback, callback, undef) {
        assert.strictEqual(mbean, "mbean");
        assert.strictEqual(methodName, "methodName");
        assert.strictEqual(params, "params");
        assert.strictEqual(signatureOrCallback, "signatureOrCallback");
        assert.strictEqual(callback, "callback");
        assert.strictEqual(undef, undefined);
        done();
      }
      client.invoke("mbean", "methodName", "params", "signatureOrCallback", "callback", "defined");
    });

    it("#disconnect", function(done) {
      client.javaJmx.disconnect = function(undef) {
        assert.strictEqual(undef, undefined);
        done();
      }
      client.disconnect("defined");
    });

  });

});
