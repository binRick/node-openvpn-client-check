#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    c = require('chalk'),
    child = require('child_process'),
    path = require('path'),
    l = console.log,
    connected = false,
    connectedTo = {
        ip: null,
        port: null
    };

program
    .version('0.1.0')
    .option('-c, --config <config>', 'OpenVPN Config File')
    .option('-o, --openvpn <openvpn>', 'OpenVPN Binary')
    .option('-t, --timeout <timeout>', 'Timeout to Fail in Seconds')
    .option('-d, --debug <debug>', 'Debug Mode')
    .parse(process.argv);

program.timeout = program.timeout || 30;
program.debug = program.debug || false;

setTimeout(function() {
    ov.kill();
    console.log('Timeout Reached. Failed to connect.');
    process.exit(-1);
}, program.timeout * 1000);

var ov = child.spawn(program.openvpn, [program.config], {
    cwd: path.dirname(program.config)
});

ov.stdout.on('data', function(o) {
    o = o.toString();
    if (o.includes('[server] Peer Connection Initiated with [AF_INET]')) {
        var tS = o.split('[server] Peer Connection Initiated with [AF_INET]')[1].trim().split(':');
        connectedTo.ip = tS[0];
        connectedTo.port = tS[1];
    }
    if (o.includes('Initialization Sequence Completed')) {
        connected = true;
        l('VPN Connected to', connectedTo.ip, 'port', connectedTo.port);
        setTimeout(function() {
            ov.kill();
        }, 100);
        if (program.debug != false)
            l(c.green.bgBlack('VPN CONNECTED!'));
    }
});
ov.stderr.on('data', function(o) {
    o = o.toString();
});
ov.on('exit', function(code) {
    if (program.debug != false)
        l('openvpn exited with code', code);
    process.exit(code);
});
