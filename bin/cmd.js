#!/usr/bin/env node

var fs = require('fs');
var minimist = require('minimist');
var spawn = require('child_process').spawn;
var parseShell = require('shell-quote').parse;
var colorize = require('ansi-color-stream');

var pack = require('../').pack;
var unpack = require('../').unpack;

var argv = minimist(process.argv.slice(2), {
    alias: { u: 'unpack', 1: 'stdout', 2: 'stderr', h: 'help' },
    'default': { stdout: 'green', stderr: 'red' },
    string: [ 'c' ],
    'boolean': [ 'i', 'u' ]
});
if (argv.help) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
    ;
}

var cmd = argv.c ? parseShell(argv.c) : argv._;
if (cmd.length === 0 || argv.unpack) {
    var ps = process.stdin.pipe(unpack())
    ps.stdout.pipe(colorize(argv.stdout)).pipe(process.stdout);
    ps.stderr.pipe(colorize(argv.stderr)).pipe(process.stdout);
}
else {
    var args = parseShell(cmd);
    var ps = spawn(args[0], args.slice(1));

    if (argv.i) process.stdin.pipe(ps.stdin);
    pack(ps).pipe(process.stdout);
}
