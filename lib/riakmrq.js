/*

   riakmrq - rapid riak map-reduce query prototyping 

   (c) 2011 Thomas Schank

*/
/*
Copyright 2011 Thomas Schank
Released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
*/var fs, helpers, lib, main, path, _;
path = require('path');
fs = require('fs');
main = path.join(path.dirname(fs.realpathSync(__filename)), '../');
lib = main + "lib/";
_ = require('underscore');
helpers = require('drtoms-nodehelpers');
exports.run = function() {
  var options, params;
  params = {
    port: '8091',
    host: '127.0.0.1'
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
    }
  ];
  return helpers.argparser.parse({
    options: options,
    help: true
  });
};