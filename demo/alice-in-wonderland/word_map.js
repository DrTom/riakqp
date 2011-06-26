(function(v) {
  var freq;
  freq = {};
  (v.values[0].data.toLowerCase().match(/\w+/g)).forEach(function(w) {
    var _ref;
    return freq[w] = ((_ref = freq[w]) != null ? _ref : 0) + 1;
  });
  return [freq];
});