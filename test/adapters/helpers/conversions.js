var libpath = process.env["JMX_COVERAGE"] ? "./../../../lib-cov" : "./../../../lib";

var assert = require("assert"),
    java = require("java"),
    conversions = require(libpath + "/adapters/helpers/conversions");

describe("conversions", function() {

  describe("#v8ToJavaClass", function() {

    [

      // js objects
      [ "some string", "java.lang.String" ],
      [ false,         "boolean"          ],
      [ 1,             "int"              ],
      [ -2147483648,   "int"              ],
      [ -2147483649,   "double"           ],
      [ 4294967295,    "int"              ],
      [ 4294967296,    "double"           ],
      [ 1.5,           "double"           ],

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

      it("should return \"" + javaClass + "\" for argument value \"" + param + "\" and typeof \"" + typeof param + "\"", function() {
        assert.strictEqual(conversions.v8ToJavaClass(param), javaClass);
      });

    });

  });

});
