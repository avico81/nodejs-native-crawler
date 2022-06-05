const http = require('http');

function _createLocalhostServer(ourClientsHtml) {
    let server = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        if(req.url === '/') {
            res.write('<html><body>' +
                '<a href="http://localhost/reviews"/>' +
                '<img src="/images/test"/>' +
                '<a href="/aboutUs"/>' +
                '<div> <a href="ourClients"/></div>' +
                '</body></html>');
        }
        if(req.url === '/aboutUs') {
            res.write('<html><body>' +
                '<p>We are awesome</p>' +
                '</body></html>');
        }
        if(req.url === '/reviews') {
            res.write('<html><body>' +
                '<div> <a href="ourClients"/></div>' +
                '</body></html>');
        }
        if(req.url === '/ourClients') {
            res.write(ourClientsHtml);
        }
        res.end();
    });
    server.listen(80);
    return server;
}

function createLocalhostServer_noLoops() {
    return _createLocalhostServer('<html><body><div><img src="/images/test"/></div></body></html>');
}

function createLocalhostServer_withLoops() {
    return _createLocalhostServer('<html><body><div><img src="/images/test"/></div><a href="/"/></body></html>');
}


module.exports = {
    createLocalhostServer_noLoops,
    createLocalhostServer_withLoops
}