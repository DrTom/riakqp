###

   riakqp - rapid riak map-reduce query prototyping with coffeescript

   (c) 2011 Thomas Schank

###

###
Copyright 2011 Thomas Schank
Released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
###

path = require('path')
fs = require('fs')
main = path.join(path.dirname(fs.realpathSync(__filename)), '../')
lib = main + "lib/"

_ = require 'underscore'
helpers = require 'drtoms-nodehelpers'

println = helpers.printer.println
print = helpers.printer.print

logging = helpers.logging
logger = logging.logger 'riakqp'

coffee = require 'coffee-script'

request = require 'request'

exports.run = () ->

  params =
    { port : '8091'
    , host : '127.0.0.1'
    , stdout: false
    , query_file: "./query.json"
    , include_header: false
    }


  options = (
    [ { short: "p"
      , long : "port"
      , description: "port of your riak cluster, default: 8091"
      , value : true
      , callback : (value) ->
          readStdin = false
          params.port = value
      }
    , { short: "h"
      , long : 'host'
      , description: "host/ip of your riak cluster, default: 127.0.0.1"
      , value : true
      , callback : (value) ->
          readStdin = false
          params.host= value
      }
    , { short: "i"
      , long : 'include-header'
      , description: "include the HTTP response header"
      , value : true
      , callback : (value) ->
          params.include_header= true
      }
    , { short: "q"
      , long : 'query-file'
      , description: "path to your query file; default: './query.json'"
      , value : true
      , callback : (value) ->
          params.query_file = value
      }
    , { short: "s"
      , long : 'stdout'
      , description: "don't query riak, print query to stdout"
      , value : true
      , callback : (value) ->
          params.stdout = true
      }
    ])

  helpers.argparser.parse
    options: options
    help: true

  query_file_path = path.join(path.dirname(fs.realpathSync(params.query_file)), '/')

  integrate_code = (obj, cont) ->
    return (cont null) if not obj.source_file?
    fs.readFile (query_file_path + obj.source_file), 'utf8', (err,data) ->
      return (cont err) if err?
      if obj.source_file.match /coffee$/
        try
          data = (coffee.compile data,{bare:true})
          data = data.replace /\n/gm,""
          data = data.replace /\s+/g," "
          data = data.replace /;$/," "
        catch err
          return cont err
      delete obj.source_file
      obj.source = data
      #println obj
      cont null


  read_riak_query = (cont) ->
    fs.readFile params.query_file, 'utf8', (err,data)->
      integration_tracker =  helpers.asynchelper.createTaskTracker(
        ( (err) ->
          return logger.error err if err?
          cont(err,JSON.stringify query)
        )
        , {name:"integration_tracker"}
      )
      if err
        logger.error "could not read query-file #{query_file}"
      else
        query = (JSON.parse data)
        outer_done = integration_tracker.createTask "outer"
        query.query.forEach (operation) ->
          for own key, value of operation
            key_done = integration_tracker.createTask key
            #println "key:", key
            #println "value:", value
            integrate_code value, (err) ->
              key_done err
        outer_done()

  read_riak_query (err,query)->
    if err?
      logger.error err
    else if params.stdout is true
      println query
    else
      req =
        uri: "http://#{params.host}:#{params.port}/mapred"
        method: 'POST'
        headers: {'content-type': 'application/json','accept-type':'application/json'}
        body: query
      request req,(err,response,body) ->
        if err?
          logger.error err 
        else
          if params.include_header
            header =
              statusCode: response.statusCode if response.statusCode?
              httpVersion: response.httpVersion
              headers: response.headers
            println header
          println body
