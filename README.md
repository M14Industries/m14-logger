# M14 Logger

Custom logging to handle measurements and counts. We use this module as a universal logging method across all hostinng platforms. We abstract logging into this module to allow us to change the underlying reporting mechanism easily.

The function call causes a command line statistic to be produced, which can be read by CloudWatch.

## Features

### Tagging

Each function has a property, an assigned value, and optional tags. The tag is a key:value object, or array of such objects (see example below).

```js
l.count(property, value, tags);
```

### Returning the log string

To return the string value of the log, instead of sending it to the console log, the functions `returnCount`, `returnMeasure`, and `returnTime` can be used.

### AWS Lambda

If 'process.env.AWS_LAMBDA_FUNCTION_NAME' is set, then the 'host' tag is set to "lambda" and the 'lambdaFunction' tag is set to the name of the lambda function.

## Usage Examples

The code:

```js

const l = new require("bristlr-logger")();

l.count("accountCreated");

l.count("accountCreated", 2);

l.count("accountCreated", 2, "tag");

l.count("accountCreated", 2, {"animal":"doggo"});

l.measure("someStat", 100);

l.measure("someStat", 100, [{"foo": "baa"}, {"animals": "cat"}]);

l.time("someStat", 100);

```

The output (`0000000000` has been used in place of the timestamp):

```
MONITORING|0000000000|1|count|accountCreated|
MONITORING|0000000000|2|count|accountCreated|
MONITORING|0000000000|2|count|accountCreated|#tags:tag
MONITORING|0000000000|2|count|accountCreated|#animal:doggo
MONITORING|0000000000|100|measure|someStat|
MONITORING|0000000000|100|measure|someStat|#foo:baa,animals:cat
MONITORING|0000000000|100ms|measure|someStat|
```