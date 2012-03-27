fs = require 'fs'
exec = require('child_process').exec

task 'build', 'batch execute everything', () ->
  invoke 'clean'
  invoke 'build:lint'  
  invoke 'test'  
  invoke 'build:document'
  invoke 'build:concat'
  invoke 'build:minify'

task 'clean', 'cleaning up dist and docs folder', () ->
  console.log 'Cleaning up dist and docs folder'
  fs.unlink 'docs'

task 'test', 'running tests with phantom', () ->
  console.log 'Running tests'
  exec 'phantomjs --local-to-remote-url-access=yes bin/phantomjs.js', (error, stdout, stderr) -> 
    console.log stdout
    console.log stderr
    if error != null
      console.log error

task 'build:document', 'generates docs with docco', () ->
  exec 'docco src/backbone.mutators.js', (error, stdout, stderr) -> 
    console.log 'Creating documentation'
    if error != null
      console.log error

task 'build:concat', 'adds the license tag to the output file', () ->
  console.log 'Adding license tag to the output file'
  rpc = fs.readFileSync 'src/backbone.mutators.js', 'utf-8'
  license = fs.readFileSync 'license.txt', 'utf-8'
  fs.writeFileSync 'backbone.mutators.js', license + '\n\n' + rpc, 'utf-8'

task 'build:minify', 'minifies the plugin', () ->
  exec 'uglifyjs -o backbone.mutators.min.js src/backbone.mutators.js', (error, stdout, stderr) -> 
    console.log 'Minifiying the plugin'
    rpc = fs.readFileSync 'backbone.mutators.min.js', 'utf-8'
    license = fs.readFileSync 'license.txt', 'utf-8'
    rpc = rpc.replace '/*jslint nomen: true, unparam: true, indent: 4, maxlen: 160, es5: false */', ''
    fs.writeFileSync 'backbone.mutators.min.js', license + '\n\n' + rpc, 'utf-8'
    if error != null
      console.log error

task 'build:lint', 'lints the plugins src file', () ->
  console.log 'Linting the plugin'
  child = exec 'nodelint -h', (error, stdout, stderr) -> 
    console.log 'out ' + stdout
    console.log 'err ' + stderr
    if error != null
      console.log 'error ' + error