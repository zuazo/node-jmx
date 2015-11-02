REPORTER=spec
COV_OUTPUT=coverage.html
COV_NODE_VER=v0.10.
NO_JSHINT_VER=v0.8.
JSHINT_ARGS=index.js lib test

style:
	node --version | grep -Fq '$(NO_JSHINT_VER)' && true || jshint $(JSHINT_ARGS)

test:
	node --version | grep -Fq '$(COV_NODE_VER)' && ! test -z $(TRAVIS_JOB_ID) && $(MAKE) test-no-coveralls test-coveralls || $(MAKE) test-no-coveralls

lib-cov:
	@./node_modules/jscoverage/bin/jscoverage lib lib-cov

test-cov:	lib-cov
	@JMX_COVERAGE=1 $(MAKE) mocha REPORTER=html-cov > $(COV_OUTPUT)
	rm -rf lib-cov
	@echo "Coverate Output File: $(COV_OUTPUT)"

test-coveralls:	lib-cov
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@JMX_COVERAGE=1 $(MAKE) mocha REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	rm -rf lib-cov

test-no-coveralls:
	@JMX_COVERAGE= $(MAKE) mocha

mocha:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --recursive --reporter $(REPORTER)

test-java-classes:
	javac -version 2>&1 | grep -F 'javac 1.7'
	javac test/*/*.java

.PHONY: test
