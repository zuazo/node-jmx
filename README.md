# node-jmx

This is a fork of node-jmx modified by Kay Chan. Please checkout "0.8.0" in change log for the changes of this fork.

[![NPM version](https://badge.fury.io/js/jmx.svg)](http://badge.fury.io/js/jmx)
[![Code Climate](https://img.shields.io/codeclimate/maintainability-percentage/zuazo/node-jmx.svg)](https://codeclimate.com/github/zuazo/node-jmx)
[![Build Status](http://img.shields.io/travis/zuazo/node-jmx.svg)](https://travis-ci.org/zuazo/node-jmx)
[![Coverage Status](http://img.shields.io/coveralls/zuazo/node-jmx.svg)](https://coveralls.io/github/zuazo/node-jmx?branch=master)

Node.js bridge library to communicate with Java applications through JMX.

## Requirements

* Tested with node `>= 0.10`.
* Java version `6` or higher.
* `node-java`: See [its installation instructions](https://github.com/joeferner/node-java/blob/v0.9.0/README.md#installation)

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
client.on("connect", run);

async function run () {
  let data = await client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage");
  var used = data.getSync('used');
  console.log("HeapMemoryUsage used: " + used.longValue);

  await client.setAttribute("java.lang:type=Memory", "Verbose", true);
  console.log("Memory verbose on");

  await client.invoke("java.lang:type=Memory", "gc", []);
  console.log("gc() done");
}
```

Client can be created by service URL instead:
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

### Client.getAttribute(mbean, attribute)

Returns an attribute from a MBean.

* `mbean` - MBean query address as string. For example "java.lang:type=Memory".
* `attribute` - Attribute name as string.
* `callback(attrValue)`

### Client.getAttributes(mbean, attributes)

Returns an attribute list from a MBean.

* `mbean` - MBean query address as string. For example "java.lang:type=Memory".
* `attributes` - Attribute names as an array of strings.
* `callback(attrValue)`

### Client.getDefaultDomain()

Returns the default domain as string.

* `callback(domainName)`

### Client.getDomains()

Returns an array of domain names.

* `callback(domainsArray)`

### Client.getMBeanCount()

Returns total the number of MBeans.

* `callback(mbeanCount)`

### Client.invoke(mbean, methodName, params, [signature])

Invokes a MBean operation.

* `mbean` - The MBean query address as string. For example `"java.lang:type=Memory"`.
* `methodName` - The method name as string.
* `params` - The parameters to pass to the operation as array. For example `[ 1, 5, "param3" ]`.
* `signature` (optional) - An array with the signature of the *params*. Sometimes may be necessary to use this if class names are not correctly detected (gives a *NoSuchMethodException*). For example `[ "int", "java.lang.Integer", "java.lang.String" ]`.
* `callback(returnedValue)`

### Client.listMBeans()

Lists server MBeans. Callback returns an array of strings containing MBean names.

### Client.on(event, callback)

Adds a listener for the especified event.

### Client.queryNamesWithObjectName(objectNameSearchString)

Search names with object name query, referring to [MBeanServerConnection.queryNames](https://docs.oracle.com/javase/7/docs/api/javax/management/MBeanServerConnection.html#queryNames(javax.management.ObjectName,%20javax.management.QueryExp)

#### events

* `connect`
* `disconnect`
* `error` - Passes the error as first parameter to the callback function.

### Client.setAttribute(mbean, attribute, value, [className])

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
| **Contributor:**     | [DarkSorrow](https://github.com/DarkSorrow)
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
