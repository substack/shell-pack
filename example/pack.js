var spawn = require('child_process').spawn;
var pack = require('../').pack;

var cmd = process.argv.slice(2).join(' ');
var ps = spawn(cmd);
process.stdin.pipe(ps.stdin);
pack(ps).pipe(process.stdout);
