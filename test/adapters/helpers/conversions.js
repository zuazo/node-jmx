var libpath = process.env.JMX_COVERAGE ? "./../../../lib-cov" : "./../../../lib";

var assert = require("assert"),
    java = require("java"),
    conversions = require(libpath + "/adapters/helpers/conversions");

describe("conversions", function() {

  describe("#v8ToJavaClass", function() {

    [

      // js objects
      [ "some string",  "java.lang.String" ],
      [ false,          "boolean"          ],
      [ 1,              "int"              ],
      [ -2147483648,    "int"              ],
      [ -2147483649,    "double"           ],
      [ 4294967295,     "int"              ],
      [ 4294967296,     "double"           ],
      [ 1.5,            "double"           ],
      [ [ "an array" ], "java.lang.Object" ], // TODO: test/fix this

      // java objects
      [ java.newInstanceSync("java.lang.String", "other string"), "java.lang.String" ],
      [ java.newInstanceSync("java.lang.Boolean", "false"),       "boolean"          ],
      [ java.newInstanceSync("java.lang.Integer", "2"),           "int"              ],
      [ java.newInstanceSync("java.lang.Long",    "2"),           "long"             ],
      [ java.newInstanceSync("java.lang.Float",   "2"),           "int"              ],
      [ java.newInstanceSync("java.lang.Float",   "1.5"),         "double"           ],
      [ java.newInstanceSync("java.lang.Double",  "2"),           "int"              ],
      [ java.newInstanceSync("java.lang.Double",  "1.5"),         "double"           ],
      [ java.newInstanceSync("javax.management.Attribute",  "name", "value"), "javax.management.Attribute" ]

    ].forEach(function(value) {
      var param = value[0];
      var javaClass = value[1];

      it("returns \"" + javaClass + "\" for argument value \"" + param + "\" and typeof \"" + typeof param + "\"", function() {
        assert.strictEqual(conversions.v8ToJavaClass(param), javaClass);
      });

    });

    it("throws an exception when the object cannot be converted", function() {
      assert.throws(
        function() {
          conversions.v8ToJavaClass(undefined);
        },
        /v8ToJavaClass[(][)]: unknown object type/
      );
    });

  });

  describe("#isJavaPrimitiveClass", function() {

    [
      "byte",
      "short",
      "int",
      "long",
      "float",
      "double",
      "boolean",
      "char"
    ].forEach(function(className) {
      it("returns true for \"" + className + "\"", function() {
        assert.strictEqual(conversions.isJavaPrimitiveClass(className), true);
      });
    });

    [
      "java.lang.Byte",
      "java.lang.Short",
      "java.lang.Integer",
      "java.lang.Long",
      "java.lang.Float",
      "java.lang.Double",
      "java.long.Boolean",
      "java.lang.String",
      "java.lang.Object",
      java.newInstanceSync("javax.management.Attribute",  "name", "value").getClassSync().getNameSync()
    ].forEach(function(className) {
      it("returns false for \"" + className + "\"", function() {
        assert.strictEqual(conversions.isJavaPrimitiveClass(className), false);
      });
    });

  });

});
