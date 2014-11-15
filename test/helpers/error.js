var libpath = process.env.JMX_COVERAGE ? "./../../lib-cov" : "./../../lib";

var assert = require("assert"),
    checkError = require(libpath + "/helpers/error").checkError;

describe("error", function() {

  function require_debug_reload() {
    delete require.cache[require.resolve(libpath + "/helpers/error")];
    return require(libpath + "/helpers/error").debug;
  }

  describe("#debug", function() {

    it("has an empty/nop debug function by default", function() {
      var debug;

      var old_node_debug = process.env.NODE_DEBUG;
      process.env.NODE_DEBUG = "other-node-module";
      debug = require_debug_reload();
      process.env.NODE_DEBUG = old_node_debug;

      debug = require_debug_reload();
      var debugString = debug.toString().replace(/\s+/g, '');
      var emptyFunc = (function() {}).toString().replace(/\s+/g, '');
      assert.strictEqual(debugString, emptyFunc);
      assert.strictEqual(debug(), undefined);
    });

    it("does not print to console by default", function() {
      var old_node_debug = process.env.NODE_DEBUG;
      process.env.NODE_DEBUG = "other-node-module";
      var debug = require_debug_reload();
      process.env.NODE_DEBUG = old_node_debug;

      var count = 0;
      var _console_log = console.log;
      var _console_error = console.error;
      console.log = function() {
        count++;
        _console_log.apply(console, arguments);
      };
      console.error = function() {
        count++;
        _console_error.apply(console, arguments);
      };

      debug("this should not be printed");

      console.log = _console_log;
      console.error = _console_error;

      assert.strictEqual(count, 0);
    });

    it("prints to console when debug is enabled", function() {
      var old_node_debug = process.env.NODE_DEBUG;
      process.env.NODE_DEBUG = "jmx";
      var debug = require_debug_reload();
      process.env.NODE_DEBUG = old_node_debug;

      var log_count = 0, error_count = 0;
      var _console_log = console.log;
      var _console_error = console.error;
      console.log = function() {
        log_count++;
        _console_log.apply(console, arguments);
      };
      console.error = function() {
        error_count++;
        // _console_error.apply(console, arguments);
      };

      debug("this should be printed");

      console.log = _console_log;
      console.error = _console_error;

      assert.strictEqual(log_count, 0, "console.log() should not be called");
      assert.strictEqual(error_count, 1, "console.error() called more than once");
    });

  });

  it("returns without error when console.error does not exist", function() {
      var old_node_debug = process.env.NODE_DEBUG;
      process.env.NODE_DEBUG = "jmx";
      var debug = require_debug_reload();
      process.env.NODE_DEBUG = old_node_debug;

      var _console_error = console.error;
      console.error = null;
      var result = debug("this should not be printed");
      console.error = _console_error;

      assert.strictEqual(result,  undefined);
  });

  describe("#checkError", function() {

    describe("when no object is passed as argument", function() {

      it("returns false when there is no error", function() {
        assert.strictEqual(checkError(undefined, undefined), false);
      });

      it("throws an exception when there is an error", function() {
        assert.throws(
          function() {
            checkError("One important error", undefined);
          },
          "One important error"
        );
      });

    });

    describe("when an object is passed as argument", function() {
      var emitCount;
      var obj = {
            emit: function() {
              emitCount++;
            }
          };
      beforeEach(function() {
        emitCount = 0;
      });

      it("emits no error when there is no error", function() {
        checkError(undefined, obj);
        assert.strictEqual(emitCount, 0);
      });

      it("emits an error when there is an error", function() {
        checkError("One important error", obj);
        assert.strictEqual(emitCount, 1);
      });

      it("returns false when there is no error", function() {
        assert.strictEqual(checkError(undefined, obj), false);
      });

      it("returns true when there is an error", function() {
        assert.strictEqual(checkError("One important error", obj), true);
      });

    });

  });

});
