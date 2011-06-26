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
    # this would be the correct version; albeit it doesn't run on riak at this time; remove the 'own' keyword
    # for own word, count of wordcount
    for word, count of wordcount
      freq[word] = (freq[word] ? 0) + count
  [sortwords(freq)]
