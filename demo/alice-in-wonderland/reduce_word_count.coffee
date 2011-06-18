(v) ->

  sortwords = (obj) ->
    sorted = {}
    keys = for key,value of obj
      key
    keys.sort()
    for key in keys
      sorted[key] = obj[key]
    sorted

  freq = {}
  v.forEach (wordcount)  ->
    for word, count of wordcount
      freq[word] = (freq[word] ? 0) + count
  [sortwords(freq)]
