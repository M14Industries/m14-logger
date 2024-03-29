module.exports = function(injectedConsoleLog, injectedTimestamp) {

	const consoleLog = injectedConsoleLog || console.log;

	function count(property, value, tags) {
		if (!value) {
			value = 1;
		}
		cloudWatchLog("count", property, value, tags);
	}

	function measure(property, value, tags) {
		cloudWatchLog("measure", property, value, tags);
	}

	function time(property, value, tags) {
		cloudWatchLog("measure", property, value + "ms", tags);
	}

	function returnCount(property, value, tags) {
		if (!value) {
			value = 1;
		}
		return cloudWatchLog("count", property, value, tags, true);
	}

	function returnMeasure(property, value, tags) {
		return cloudWatchLog("measure", property, value, tags, true);
	}

	function returnTime(property, value, tags) {
		return cloudWatchLog("measure", property, value + "ms", tags, true);
	}

	function cloudWatchLog(type, property, value, tags, returnString) {

		const timestamp = injectedTimestamp || Math.round(new Date().getTime() / 1000);
		const logTags = getLogTags(tags);

		const logString = `MONITORING|${timestamp}|${value}|${type}|${property}|${logTags}`;

		if (returnString) {
			return logString;
		}
		
		consoleLog(logString);
	}

	function getLogTags(tags) {

		const logTags = [];

		if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
			logTags.push("host:lambda");
			logTags.push("lambdaFunction:" + process.env.AWS_LAMBDA_FUNCTION_NAME);
		}

		if (!tags && !logTags) {
			return "";
		}

		if (tags) {

			if (!Array.isArray(tags)) {
				tags = [tags];
			}

			tags.forEach(function(tag) {

				if (typeof tag == "string") {
					logTags.push("tags:" + tag);
				} else {
					const keys = Object.keys(tag);
					keys.forEach(function(key){
						logTags.push(key + ":" + tag[key]);
					});
				}
			});
		}

		if (logTags.length == 0) {
			return "";
		}

		return "#" + logTags.join(",");
	}

	return {
		count,
		measure,
		time,
		returnCount,
		returnMeasure,
		returnTime
	};

};