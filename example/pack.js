var spawn = require('child_process').spawn;
var pack = require('../').pack;

var cmd = process.argv.slice(2).join(' ');
var ps = process.stdin.pipe(spawn(cmd));
pack(ps).pipe(process.stdout);
