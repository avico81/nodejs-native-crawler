const { test } = require('node:test');
const assert = require('assert');
const manager = require('./manager');
const utils = require('./utils');
const testUtils = require('./testUtils');
const { exec } = require("child_process");


test('isIp positive test', () => {
    assert.ok(utils.isIp('1.2.3.4'), 'expected true');
})

test('isIp negative test', () => {
    assert.strictEqual(utils.isIp('https://www.google.com/'), false, 'expected false');
})

test('extractDomain positive localhost', () => {
    assert.strictEqual('localhost', utils.extractDomain('localhost'), 'expected localhost');
});

test('extractDomain positive long host', () => {
    assert.strictEqual('google.com', utils.extractDomain('a.b.c.google.com'), 'expected google.com');
});

test('extractDomain positive same sub-domain', () => {
    assert.strictEqual(utils.extractDomain('www.google.com'), utils.extractDomain('www.google.com'), 'expected equal');
});

test('extractDomain negative different domain', () => {
    assert.notEqual(utils.extractDomain('www.google.com'), utils.extractDomain('www.amazon.com'), 'expected not equal');
});

test('extractDomain positive different sub-domain', () => {
    assert.strictEqual(utils.extractDomain('www.google.com'), utils.extractDomain('privacy.google.com'), 'expected equal');
});

test('crawler negative missing arguments', () => {
    exec('./crawl', (error, stdout, stderr) => {
        assert.ok(error !== null && stderr !== null, 'expected true');
        assert.strictEqual(stderr, 'USAGE: ./crawl -n <# of workers> <URL>\n', 'expected equal');
    });
})

const expectedLogs = [
    'http://localhost/',
    'http://localhost/reviews',
    'http://localhost/aboutUs',
    'http://localhost/ourClients',
];

function _test_server(func) {
    let server = func();
    exec('./crawl -n 3 "http://localhost/"', (error, stdout, stderr) => {
        try{
            assert.ok(stdout !== null, 'expected true');
            let consoleLog = stdout.split('\n').slice(0, -1); // omit last item ('')
            assert.strictEqual(consoleLog.length, 4, 'expected equal');
            expectedLogs.forEach(log => assert.ok(consoleLog.includes(log), 'expected true'));
        } finally {
            server.close();
        }
    });
}

test('test crawling no loops', () => {
    _test_server(testUtils.createLocalhostServer_noLoops);
});

test('test crawling with loops', () => {
    _test_server(testUtils.createLocalhostServer_withLoops);
});



