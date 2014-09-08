var spawn = require('child_process').spawn;
var colorize = require('ansi-color-stream');
var unpack = require('../').unpack;

var cmd = process.argv.slice(2).join(' ');
var ps = process.stdin.pipe(unpack());

ps.stdout.pipe(colorize('green')).pipe(process.stdout);
ps.stderr.pipe(colorize('red')).pipe(process.stderr);
