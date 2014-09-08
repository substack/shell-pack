var spawn = require('child_process').spawn;
var pack = require('../').pack;

var cmd = process.argv.slice(2);
var ps = spawn(cmd[0], cmd.slice(1));

process.stdin.pipe(ps.stdin);
pack(ps).pipe(process.stdout);
