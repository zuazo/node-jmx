# node-jmx

node.js library to communicate with java applications through JMX.

## Usage

### Examples

```js
var jmx = require("jmx");

client = jmx.createClient({
  host: "localhost", // optional
  port: 3000
});

client.connect();
client.on("connect", function() {
  client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage", function(data) {
    console.log(data.toString());
  });

  client.setAttribute("java.lang:type=Memory", "Verbose", true, function(data) {
    console.log("Memory verbose on"); // callback is optional
  });

  client.invoke("java.lang:type=Memory", "gc", [], function(data) {
    console.log("gc() done");
  });
});
```

```js
client = jmx.createClient({
  service: "service:jmx:rmi:///jndi/rmi://localhost:3000/jmxrmi",
});
```

### Error handling

Errors are **not printed** to the console by default. You can catch them with something like the following:

```js
client.on("error", function(err) {
  // ...
});
```

## Debugging

You can enable debugging and error printing to console using `NODE_DEBUG` environment variable:

```bash
NODE_DEBUG="jmx" node [...]
```


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

