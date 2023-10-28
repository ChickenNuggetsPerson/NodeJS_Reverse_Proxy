const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});


let hostList = [{
    domain: "steelefolio.com",
    port: 19133,
    isHttps: false
},{
    domain: "ducks.steelefolio.com",
    port: 19134,
    isHttps: false
},{
    domain: "library.steeleinnovations.com",
    port: 19135,
    isHttps: true
}]

const server = http.createServer((req, res) => {
    const hostname = req.headers.host;
    console.log(hostname)

    // Define the target ports for different domains
    let targetPort = 0;
    let isHttps = false;

    hostList.forEach(host => {
        if (hostname.startsWith(host.domain)) {
            targetPort = host.port
            isHttps = host.isHttps
        }
    })

    if (targetPort == 0) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Domain not configured');
        return;
    }

    if (isHttps) {
        proxy.web(req, res, { target: `https://localhost:${targetPort}` });
    } else {
        proxy.web(req, res, { target: `http://localhost:${targetPort}` });
    }
});

server.listen(19132);
