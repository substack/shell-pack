# shell-pack

pack and unpack stdout and stderr in a binary-efficient way

[![build status](https://secure.travis-ci.org/substack/shell-pack.png)](http://travis-ci.org/substack/shell-pack)

# example

pack:

``` js
var spawn = require('child_process').spawn;
var pack = require('shell-pack').pack;

var cmd = process.argv.slice(2).join(' ');
var ps = spawn(cmd);

process.stdin.pipe(ps.stdin);
pack(spawn(cmd)).pipe(process.stdout);
```

unpack:

``` js
var spawn = require('child_process').spawn;
var colorize = require('ansi-color-stream');
var unpack = require('shell-pack').unpack;

var cmd = process.argv.slice(2).join(' ');
var ps = process.stdin.pipe(unpack());

ps.stdout.pipe(colorize('green')).pipe(process.stdout);
ps.stderr.pipe(colorize('red')).pipe(process.stderr);
```

Just pipe the pack output into the unpack:

```
$ node pack.js cal | node unpack.js
   September 2014     
Su Mo Tu We Th Fr Sa  
    1  2  3  4  5  6  
 7  8  9 10 11 12 13  
14 15 16 17 18 19 20  
21 22 23 24 25 26 27  
28 29 30           
```

In a real setting you would serialize the results in between piping the
processes together.

# methods

``` js
var pack = require('shell-pack').pack
var unpack = require('shell-pack').unpack
```

## var rs = pack(ps)

Pack and multiplex the output from streams `ps` into a readable strem `rs`.

`ps` should have:

* `ps.stdout`
* `ps.stderr`
* an `('exit', code)` event

## var ps = unpack()

Return a faux-process object `ps` that is a writable stream that accepts output
created with `pack()` data. `ps` has process-like properties:

* `ps.stdout`
* `ps.stderr`

## ps.exitCode(cb)

Call the exit code with `cb(code)` when the exit code is read in.

This is like the `'exit'` event but works after the event has already fired.

# events

## ps.on('exit', function (code) {})

Just like a real process, this event gets emitted with the process exit code.

# usage

This package also ships with a command-line version.

```
usage: shell-pack OPTIONS - COMMAND

  Execute
    
  -c  Specify a command to run as a string instead of COMMAND.
  -i  if given, pipe stdin into the spawned process

usage: shell-pack -u OPTIONS
       shell-pack # with no COMMAND given

  Unpack STDIN into colorized channels.

  -1, --stdout  color to use for stdout, default: green
  -2, --stderr  color to use for stderr, default: red

```

# install

With [npm](https://npmjs.org) do:

```
npm install shell-pack
```

# license

MIT
