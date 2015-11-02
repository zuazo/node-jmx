# node-jmx Testing

```bash
$ npm install -g jshint
$ make style test
```

You will need to set the `JAVA_HOME` environment variable if the java binary is not in your *PATH*.

## Coverage

```bash
$ make test-cov
```

The HTML output file will be at `./coverage.html`.
