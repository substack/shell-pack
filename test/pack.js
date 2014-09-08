var test = require('tape');
var through = require('through2');
var EventEmitter = require('events').EventEmitter;
var pack = require('../').pack;
var unpack = require('../').unpack;
var concat = require('concat-stream');

test('pack/unpack', function (t) {
    t.plan(5);
    
    var ps = new EventEmitter;
    ps.stdout = through();
    ps.stderr = through();
    
    var ps_ = pack(ps).pipe(unpack());
    ps_.stdout.pipe(concat(function (body) {
        t.equal(body.toString('utf8'), 'beep');
    }));
    ps_.stderr.pipe(concat(function (body) {
        t.equal(body.toString('utf8'), 'boop');
    }));
    ps_.on('exit', function (code) {
        t.equal(code, 123);
    });
    ps_.exitCode(function (code) {
        t.equal(code, 123);
    });
    
    ps.stdout.end('beep');
    ps.stderr.end('boop');
    ps.emit('exit', 123);
    
    ps_.exitCode(function (code) {
        t.equal(code, 123);
    });
});
