(value, keyData, arg) ->
  data = Riak.mapValuesJson(value)[0]
  if data.High? and parseFloat(data.High) > 600.00
    [data]
  else
    []
