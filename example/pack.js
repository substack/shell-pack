var spawn = require('child_process').spawn;
var pack = require('../').pack;

var cmd = process.argv.slice(2).join(' ');
var ps = spawn(cmd);

process.stdin.pipe(ps.stdin);
pack(spawn(cmd)).pipe(process.stdout);
