(v) ->
  freq = {}
  (v.values[0].data.toLowerCase().match(/\w+/g)).forEach (w) ->
    freq[w] = (freq[w] ? 0) + 1
  [freq]
