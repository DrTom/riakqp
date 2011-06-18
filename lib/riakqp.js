/*

   riakqp - rapid riak map-reduce query prototyping with coffeescript

   (c) 2011 Thomas Schank

*/
/*
Copyright 2011 Thomas Schank
Released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
*/var coffee, fs, helpers, lib, logger, logging, main, path, print, println, request, _;
var __hasProp = Object.prototype.hasOwnProperty;
path = require('path');
fs = require('fs');
main = path.join(path.dirname(fs.realpathSync(__filename)), '../');
lib = main + "lib/";
_ = require('underscore');
helpers = require('drtoms-nodehelpers');
println = helpers.printer.println;
print = helpers.printer.print;
logging = helpers.logging;
logger = logging.logger('riakqp');
coffee = require('coffee-script');
request = require('request');
exports.run = function() {
  var integrate_code, options, params, query_file_path, read_riak_query;
  params = {
    port: '8091',
    host: '127.0.0.1',
    stdout: false,
    query_file: "./query.json",
    include_header: false
  };
  options = [
    {
      short: "p",
      long: "port",
      description: "port of your riak cluster, default: 8091",
      value: true,
      callback: function(value) {
        var readStdin;
        readStdin = false;
        return params.port = value;
      }
    }, {
      short: "h",
      long: 'host',
      description: "host/ip of your riak cluster, default: 127.0.0.1",
      value: true,
      callback: function(value) {
        var readStdin;
        readStdin = false;
        return params.host = value;
      }
    }, {
      short: "i",
      long: 'include-header',
      description: "include the HTTP response header",
      value: true,
      callback: function(value) {
        return params.include_header = true;
      }
    }, {
      short: "q",
      long: 'query-file',
      description: "path to your query file; default: './query.json'",
      value: true,
      callback: function(value) {
        return params.query_file = value;
      }
    }, {
      short: "s",
      long: 'stdout',
      description: "don't query riak, print query to stdout",
      value: true,
      callback: function(value) {
        return params.stdout = true;
      }
    }
  ];
  helpers.argparser.parse({
    options: options,
    help: true
  });
  query_file_path = path.join(path.dirname(fs.realpathSync(params.query_file)), '/');
  integrate_code = function(obj, cont) {
    if (!(obj.source_file != null)) {
      return cont(null);
    }
    return fs.readFile(query_file_path + obj.source_file, 'utf8', function(err, data) {
      if (err != null) {
        return cont(err);
      }
      if (obj.source_file.match(/coffee$/)) {
        try {
          data = coffee.compile(data, {
            bare: true
          });
          data = data.replace(/\n/gm, "");
          data = data.replace(/\s+/g, " ");
          data = data.replace(/;$/, " ");
        } catch (err) {
          return cont(err);
        }
      }
      delete obj.source_file;
      obj.source = data;
      return cont(null);
    });
  };
  read_riak_query = function(cont) {
    return fs.readFile(params.query_file, 'utf8', function(err, data) {
      var integration_tracker, outer_done, query;
      integration_tracker = helpers.asynchelper.createTaskTracker((function(err) {
        if (err != null) {
          return logger.error(err);
        }
        return cont(err, JSON.stringify(query));
      }), {
        name: "integration_tracker"
      });
      if (err) {
        return logger.error("could not read query-file " + query_file);
      } else {
        query = JSON.parse(data);
        outer_done = integration_tracker.createTask("outer");
        query.query.forEach(function(operation) {
          var key, key_done, value, _results;
          _results = [];
          for (key in operation) {
            if (!__hasProp.call(operation, key)) continue;
            value = operation[key];
            key_done = integration_tracker.createTask(key);
            _results.push(integrate_code(value, function(err) {
              return key_done(err);
            }));
          }
          return _results;
        });
        return outer_done();
      }
    });
  };
  return read_riak_query(function(err, query) {
    var req;
    if (err != null) {
      return logger.error(err);
    } else if (params.stdout === true) {
      return println(query);
    } else {
      req = {
        uri: "http://" + params.host + ":" + params.port + "/mapred",
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept-type': 'application/json'
        },
        body: query
      };
      return request(req, function(err, response, body) {
        var header;
        if (err != null) {
          return logger.error(err);
        } else {
          if (params.include_header) {
            header = {
              statusCode: response.statusCode != null ? response.statusCode : void 0,
              httpVersion: response.httpVersion,
              headers: response.headers
            };
            println(header);
          }
          return println(body);
        }
      });
    }
  });
};