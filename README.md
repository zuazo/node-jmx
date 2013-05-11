# node-jmx

node.js bridge library to communicate with java applications through JMX.

[![NPM version](https://badge.fury.io/js/jmx.png)](http://badge.fury.io/js/jmx)
[![Build Status](https://travis-ci.org/onddo/node-jmx.png)](https://travis-ci.org/onddo/node-jmx)
[![Coverage Status](https://coveralls.io/repos/onddo/node-jmx/badge.png?branch=master)](https://coveralls.io/r/onddo/node-jmx?branch=master)

## Requirements:

* Java version 6 or higher.
* `node-java`: See [its installation instructions](https://github.com/nearinfinity/node-java/blob/master/README.md#installation-linuxwindows).

## Installation

Before the installation, you must set your `JAVA_HOME` environment variable to point to the java JRE installation directory. For example:

```bash
$ export JAVA_HOME=/usr/lib/jvm/default-java
$ npm install jmx
```

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

### Client.getDefaultDomain(callback)

Returns the default domain as string.

* `callback(domainName)`

### Client.getDomains(callback)

Returns an array of domain names.

* `callback(domainsArray)`

### Client.getMBeanCount(callback)

Returns total the number of MBeans.

* `callback(mbeanCount)`

### Client.invoke(mbean, methodName, params, [signature,] callback)

Invokes a MBean operation.

* `mbean` - The MBean query address as string. For example `"java.lang:type=Memory"`.
* `methodName` - The method name as string.
* `params` - The parameters to pass to the operation as array. For example `[ 1, 5, "param3" ]`.
* `signature` (optional) - An array with the signature of the *params*. Sometimes may be necessary to use this if class names are not correctly detected (gives a *NoSuchMethodException*). For example `[ "int", "java.lang.Integer", "java.lang.String" ]`.
* `callback(returnedValue)`

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
* `className` (optional) - The attribute java className. Sometimes may be necessary to use this if value type is not correctly detected (gives a *InvalidAttributeValueException*). For example `"java.lang.Long".
* `callback()` (optional)

## Error handling

Errors are **not printed** to the console by default. You can catch them with something like the following:

```js
client.on("error", function(err) {
  // ...
});
```

## Testing

```bash
$ make test
```

You will need to set the `JAVA_HOME` environment variable if the java binary is not in your *PATH*.

### Coverage

```bash
$ make test-cov
```

The HTML output file will be at `./coverage.html`.

## Debugging

You can enable debugging and error printing to console using `NODE_DEBUG` environment variable:

```bash
$ NODE_DEBUG="jmx" node [...]
```

## History

### 0.1.0

* The first published version.


## License and Author

|                      |                                          |
|:---------------------|:-----------------------------------------|
| **Author:**          | Xabier de Zuazo (<xabier@onddo.com>)
| **Copyright:**       | Copyright (c) 2013 Onddo Labs, SL.
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

