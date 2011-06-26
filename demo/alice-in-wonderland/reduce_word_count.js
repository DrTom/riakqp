var __hasProp = Object.prototype.hasOwnProperty;
(function(v) {
  var freq, sortwords;
  sortwords = function(obj) {
    var key, keys, sorted, value, _i, _len;
    sorted = {};
    keys = (function() {
      var _results;
      _results = [];
      for (key in obj) {
        value = obj[key];
        _results.push(key);
      }
      return _results;
    })();
    keys.sort();
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      sorted[key] = obj[key];
    }
    return sorted;
  };
  freq = {};
  v.forEach(function(wordcount) {
    var count, word, _ref, _results;
    _results = [];
    for (word in wordcount) {
      if (!__hasProp.call(wordcount, word)) continue;
      count = wordcount[word];
      _results.push(freq[word] = ((_ref = freq[word]) != null ? _ref : 0) + count);
    }
    return _results;
  });
  return [sortwords(freq)];
});