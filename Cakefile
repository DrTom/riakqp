child_process = require 'child_process'
sys = require 'sys'
util   = require 'util'

spawn = child_process.spawn
exec = child_process.exec

spawnWithOutput = (name,options)->
  red   = '\033[0;31m'
  reset = '\033[0m'
  bold  = '\033[1m'
  proc = spawn name, options
  proc.stdout.on 'data', (data) ->
    util.print name+": "+data
  proc.stderr.on 'data', (data) ->
    util.print red+name+": "+data+reset
  proc.on 'exit', (code) ->
    console.log('child process exited with code ' + code)
  console.log('spawned child ' + bold + name + " " + options.join(" ") + reset + ' pid: ' + proc.pid)

task 'build', '', () ->

  spawnWithOutput 'coffee', ['--bare','-o','.','-c', 'src/']

task 'continuous-build', '', () ->

  spawnWithOutput 'coffee', ['-w','--bare','-o','.','-c', 'src/']

task 'test','run the test suite', () ->

  exec 'nodeunit test/lib/',  (err,stdout,stderr) ->
    util.print stdout
    util.print stderr
    
 
 

