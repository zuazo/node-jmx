REPORTER=spec
COV_OUTPUT=coverage.html

test:
	test -z ${TRAVIS_JOB_ID} && $(MAKE) test-no-coveralls || $(MAKE) test-coveralls

lib-cov:
	jscoverage lib lib-cov

test-cov:	lib-cov
	@JMX_COVERAGE=1 $(MAKE) test REPORTER=html-cov > $(COV_OUTPUT)
	rm -rf lib-cov
	@echo "Coverate Output File: $(COV_OUTPUT)"

test-coveralls:	lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@JMX_COVERAGE=1 $(MAKE) test REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	rm -rf lib-cov

test-no-coveralls:
	@JMX_COVERAGE= NODE_ENV=test ./node_modules/.bin/mocha -b --recursive --reporter $(REPORTER)

.PHONY: test
