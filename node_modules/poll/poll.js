var Repeat = require("repeat");

var isFunction = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};
var isArray = function (obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
};

var subRange = function (obj, from, to) {
  if (typeof obj == 'string') return obj.substring(from, to);
  else if (isArray(obj)) {
    return obj.slice(from, to);
  }
};


/**
 * Creates a function returning the data to be polled
 * @param object An object whose property to poll, or a function that returns data to poll
 * @param property
 * @return {Function}
 */
var makeReader = function (object, property) {
  if (property == undefined) return function () {
    return object;
  };
  if (isFunction(object[property])) return function () {
    return object[property].call(object)
  };
  return function () {
    return object[property]
  };
};

module.exports = function (object, property) {
  var getData = isFunction(object) ? object : makeReader(object, property);
  var poll = new Repeat();
  var lastLength = 0;
  return poll.task(function () {
    var data = getData(),
        currentLength = data.length;
    if (currentLength == lastLength) {
      this.mute();
    }
    var diff = subRange(data, lastLength, currentLength);
    lastLength = currentLength;
    return diff;
  });
};
