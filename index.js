var multiplex = require('multiplex');
var duplexer = require('duplexer2');
var Writable = require('readable-stream/writable');
var Readable = require('readable-stream/readable');
var concat = require('concat-stream');

exports.pack = function (ps) {
    var m = multiplex();
    var meta = m.createStream(0);
    ps.stdout.pipe(m.createStream(1));
    ps.stderr.pipe(m.createStream(2));
    
    var pending = 3;
    function onend () { if (--pending === 0) m.end() }
    ps.stdout.once('end', onend);
    ps.stderr.once('end', onend);
    ps.on('exit', function (code) {
        meta.end(String(code));
        onend();
    });
    
    var output = new Readable;
    var waiting = false;
    
    m.on('readable', function () {
        if (waiting) output._read();
        waiting = false;
    });
    
    output._read = function () {
        var buf, reads = 0;
        while ((buf = m.read()) !== null) {
            this.push(buf);
            reads ++;
        }
        if (reads === 0) waiting = true;
    };
    m.once('end', function () { output.push(null) });
    return output;
};

exports.unpack = function () {
    var m = multiplex();
    var p = new Writable;
    p._write = function (buf, enc, next) {
        m._write(buf, enc, next);
    };
    p.once('finish', function () { m.end() });
    
    p.stdout = m.createStream(1);
    p.stderr = m.createStream(2);
    
    var code = null;
    p.exitCode = function (cb) {
        if (code === null) p.once('exit', cb)
        else cb(code)
    };
    m.createStream(0).pipe(concat(function (body) {
        code = Number(body);
        p.emit('exit', code);
    }));
    
    return p;
};
