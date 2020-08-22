const assert = require('assert');

describe("Example code", function() {

	it("The example code runs", function(done) {

		const l = new require("../index.js")();

		l.count("accountCreated");

		l.count("accountCreated", 2);
		
		l.count("accountCreated", 2, "tag");
		
		l.count("accountCreated", 2, {"animal":"doggo"});
		
		l.measure("someStat", 100);
		
		l.measure("someStat", 100, [{"foo": "baa"}, {"animals": "cat"}]);
		
		l.time("someStat", 100);

		done();

	});
});