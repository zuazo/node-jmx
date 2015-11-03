# node-jmx

[![NPM version](https://badge.fury.io/js/jmx.svg)](http://badge.fury.io/js/jmx)
[![Code Climate](http://img.shields.io/codeclimate/github/zuazo/node-jmx.svg)](https://codeclimate.com/github/zuazo/node-jmx)
[![Build Status](http://img.shields.io/travis/zuazo/node-jmx/0.5.0.svg)](https://travis-ci.org/zuazo/node-jmx)
[![Coverage Status](http://img.shields.io/coveralls/zuazo/node-jmx/0.5.0.svg)](https://coveralls.io/r/zuazo/node-jmx?branch=0.5.0)

Node.js bridge library to communicate with Java applications through JMX.

## Requirements

* Tested with node `>= 0.10`.
* Java version `6` or higher.
* `node-java`: See [its installation instructions](https://github.com/joeferner/node-java/tree/v0.6.0#installation)

## Installation

    $ npm install jmx

## Usage examples

```js
var jmx = require("jmx");

client = jmx.createClient({
  host: "localhost", // optional
  port: 3000
});

client.connect();
client.on("connect", function() {

  client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage", function(data) {
    var used = data.getSync('used');
    console.log("HeapMemoryUsage used: " + used.longValue);
    // console.log(data.toString());
  });

  client.setAttribute("java.lang:type=Memory", "Verbose", true, function() {
    console.log("Memory verbose on"); // callback is optional
  });

  client.invoke("java.lang:type=Memory", "gc", [], function(data) {
    console.log("gc() done");
  });

});
```

```js
client = jmx.createClient({
  service: "service:jmx:rmi:///jndi/rmi://localhost:3000/jmxrmi"
});
```
You can check the [node-java documentation](https://github.com/nearinfinity/node-java/blob/master/README.md#quick-examples) to learn how to work with java objects in node.js.

## Documentation

### jmx.createClient(options)

Returns a `Client` object.

#### options

`options` is a hash table with the following values:

* `service` - The full service URL string, with *host*, *port*, *protocol* and *urlPath* included. For example `"service:jmx:rmi:///jndi/rmi://localhost:3000/jmxrmi"`.
* `host` - Hostname to connect to (defaults to `"localhost"`).
* `port` - JMX port number to connect to.
* `protocol` - Protocol to use (defaults to `"rmi"`).
* `urlPath` - JMX URL Path (defaults to `"/jndi/{protocol}://{host}:{port}/jmx{protocol}"`).
* `username` - JMX authentication username.
* `password` - JMX authentication password.

### Client.connect()

Connects to the JMX server. Emits `connect` event when done.

### Client.disconnect()

Disconnects from the JMX server. Emits `disconnect` event when done.

### Client.getAttribute(mbean, attribute, callback)

Returns an attribute from a MBean.

* `mbean` - MBean query address as string. For example "java.lang:type=Memory".
* `attribute` - Attribute name as string.
* `callback(attrValue)`

### Client.getAttributes(mbean, attributes, callback)

Returns an attribute list from a MBean.

* `mbean` - MBean query address as string. For example "java.lang:type=Memory".
* `attributes` - Attribute names as an array of strings.
* `callback(attrValue)`

### Client.getDefaultDomain(callback)

Returns the default domain as string.

* `callback(domainName)`

### Client.getDomains(callback)

Returns an array of domain names.

* `callback(domainsArray)`

### Client.getMBeanCount(callback)

Returns total the number of MBeans.

* `callback(mbeanCount)`

### Client.invoke(mbean, methodName, params, [signature,] [callback])

Invokes a MBean operation.

* `mbean` - The MBean query address as string. For example `"java.lang:type=Memory"`.
* `methodName` - The method name as string.
* `params` - The parameters to pass to the operation as array. For example `[ 1, 5, "param3" ]`.
* `signature` (optional) - An array with the signature of the *params*. Sometimes may be necessary to use this if class names are not correctly detected (gives a *NoSuchMethodException*). For example `[ "int", "java.lang.Integer", "java.lang.String" ]`.
* `callback(returnedValue)`

### Client.listMBeans(callback)

Lists server MBeans. Callback returns an array of strings containing MBean names.

### Client.on(event, callback)

Adds a listener for the especified event.

#### events

* `connect`
* `disconnect`
* `error` - Passes the error as first parameter to the callback function.

### Client.setAttribute(mbean, attribute, value, [className,] [callback])

Changes an attribute value of the MBean.

* `mbean` - The MBean query address as string. For example `"java.lang:type=Memory"`.
* `attribute` - The attribute name as string.
* `value` - The attribute value.
* `className` (optional) - The attribute java className. Sometimes may be necessary to use this if value type is not correctly detected (gives a *InvalidAttributeValueException*). For example `"java.lang.Long"`.
* `callback()` (optional)

## Error handling

Errors are **not printed** to the console by default. You can catch them with something like the following:

```js
client.on("error", function(err) {
  // ...
});
```

## Debugging

You can enable debugging and error printing to console using `NODE_DEBUG` environment variable:

    $ NODE_DEBUG="jmx" node [...]

## Testing

See [TESTING.md](https://github.com/zuazo/node-jmx/blob/master/TESTING.md).

## Contributing

Please do not hesitate to [open an issue](https://github.com/zuazo/node-jmx/issues/new) with any questions or problems.

See [CONTRIBUTING.md](https://github.com/zuazo/node-jmx/blob/master/CONTRIBUTING.md).

## TODO

See [TODO.md](https://github.com/zuazo/node-jmx/blob/master/TODO.md).

## History

See [CHANGELOG.md](https://github.com/zuazo/node-jmx/blob/master/CHANGELOG.md).


## License and Author

|                      |                                          |
|:---------------------|:-----------------------------------------|
| **Author:**          | [Xabier de Zuazo](https://github.com/zuazo) (<xabier@zuazo.org>)
| **Contributor:**     | [Eric](https://github.com/ericbroda)
| **Copyright:**       | Copyright (c) 2015, Xabier de Zuazo
| **Copyright:**       | Copyright (c) 2013-2015 Onddo Labs, SL.
| **License:**         | Apache License, Version 2.0

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
