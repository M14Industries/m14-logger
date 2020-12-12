const assert = require('assert');

describe("Logger can return values", function() {

	beforeEach(function() {
		delete process.env.AWS_LAMBDA_FUNCTION_NAME;
	});

	it("Logger can count a value", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnCount("cats", 2);

		assert.equal(returnedString, "MONITORING|123456|2|count|cats|");
		done();

	});

	it("Logger can count a value with tag", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnCount("cats", 2, "foo");

		assert.equal(returnedString, "MONITORING|123456|2|count|cats|#tags:foo");
		done();

	});

	it("Logger can count a value with multiple tags", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnCount("cats", 2, [{
			"config": "foo"
		}, {
			"tag": "baa"
		}]);

		assert.equal(returnedString, "MONITORING|123456|2|count|cats|#config:foo,tag:baa");
		done();

	});

	it("Logger counts 1 by default", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnCount("sheep");

		assert.equal(returnedString, "MONITORING|123456|1|count|sheep|");
		done();

	});

	it("Logger can measure a value", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnMeasure("dogs.speed", 0.66);

		assert.equal(returnedString, "MONITORING|123456|0.66|measure|dogs.speed|");
		done();

	});

	it("Logger can measure a value with tag", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnMeasure("dogs.speed", 0.66, "foo");

		assert.equal(returnedString, "MONITORING|123456|0.66|measure|dogs.speed|#tags:foo");
		done();

	});

	it("Logger can time a value and save it in as a ms measure", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnTime("cows", 128);

		assert.equal(returnedString, "MONITORING|123456|128ms|measure|cows|");
		done();

	});

	it("Logger can time a value and save it in as a ms measure with tag", function(done) {

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnTime("cows", 128, {"config":"baa"});

		assert.equal(returnedString, "MONITORING|123456|128ms|measure|cows|#config:baa");
		done();

	});

	it("Add Lambda tag if Lambda env var present", function(done) {

		process.env.AWS_LAMBDA_FUNCTION_NAME = "lambdaFunctionName";

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnTime("cows", 128);

		assert.equal(returnedString, "MONITORING|123456|128ms|measure|cows|#host:lambda,lambdaFunction:lambdaFunctionName");
		done();

	});

	it("Add Lambda tag if Lambda env var present, with tags", function(done) {

		process.env.AWS_LAMBDA_FUNCTION_NAME = "lambdaFunctionName";

		const l = new require("../index.js")(fakeConsoleLog, fakeTimestamp);

		const returnedString = l.returnTime("cows", 128, [{"config":"bristlr"}, {"tags":"stats"}]);

		assert.equal(returnedString, "MONITORING|123456|128ms|measure|cows|#host:lambda,lambdaFunction:lambdaFunctionName,config:bristlr,tags:stats");
		done();

	});
});

const fakeTimestamp = 123456;

let loggedString = "";
const fakeConsoleLog = function(stringToLog) {
	loggedString = stringToLog;
}