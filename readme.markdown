# shell-pack

pack and unpack stdout and stderr in a binary-efficient way

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

# install

With [npm](https://npmjs.org) do:

```
npm install shell-pack
```

# license

MIT
