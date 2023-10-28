const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    const host = req.headers.host;

    // Define the target ports for different domains
    let targetPort;
    if (host === 'steelefolio.com') {
        targetPort = 19133;
    } else if (host === 'ducks.steelefolio.com') {
        targetPort = 19134;
    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Domain not configured');
        return;
    }

    // Forward the request to the target port
    proxy.web(req, res, { target: `localhost:${targetPort}` });
});

server.listen(19132);
