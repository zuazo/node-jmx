var assert = require("assert"),
    checkError = require("./../../lib/helpers/error").checkError;

describe("error", function() {

  function require_debug_reload() {
    delete require.cache[require.resolve('./../../lib/helpers/error')]
    return require("./../../lib/helpers/error").debug;
  }

  describe("#debug", function() {

    it("should not print to console by default", function() {
      var debug = require_debug_reload();

      var count = 0;
      var _console_log = console.log;
      var _console_error = console.error;
      console.log = function() {
        count++;
        _console_log.apply(console, arguments);
      }
      console.error = function() {
        count++;
        _console_error.apply(console, arguments);
      }

      debug("this should not be printed");

      console.log = _console_log;
      console.error = _console_error;

      assert.deepEqual(count, 0);
    });

    it("should print to console when debug is enabled", function() {
      var old_node_debug = process.env.NODE_DEBUG;
      process.env.NODE_DEBUG = 'jmx';
      var debug = require_debug_reload();
      process.env.NODE_DEBUG = old_node_debug;

      var log_count = 0, error_count = 0;
      var _console_log = console.log;
      var _console_error = console.error;
      console.log = function() {
        log_count++;
        _console_log.apply(console, arguments);
      }
      console.error = function() {
        error_count++;
        // _console_error.apply(console, arguments);
      }

      debug("this should be printed");

      console.log = _console_log;
      console.error = _console_error;

      assert.deepEqual(log_count, 0, "console.log() should not be called");
      assert.deepEqual(error_count, 1, "console.error() called more than once");
    });

  });

  describe("#checkError", function() {

    describe("when no object is passed as argument", function() {

      it("should return false when there is no error", function() {
        assert.deepEqual(checkError(undefined, undefined), false);
      });

      it("should throw an exception when there is an error", function() {
        assert.throws(
          function() {
            checkError("One important error", undefined)
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

      it("should emit no error when there is no error", function() {
        checkError(undefined, obj);
        assert.deepEqual(emitCount, 0);
      });

      it("should emit an error when there is an error", function() {
        checkError("One important error", obj);
        assert.deepEqual(emitCount, 1);
      });

      it("should return false when there is no error", function() {
        assert.deepEqual(checkError(undefined, obj), false);
      });

      it("should return true when there is an error", function() {
        assert.deepEqual(checkError("One important error", obj), true);
      });

    });

  });

});
