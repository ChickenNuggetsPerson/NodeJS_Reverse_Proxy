const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});


let hostList = [{
    domain: "steelefolio.com",
    port: 19133,
},{
    domain: "ducks.steelefolio.com",
    port: 19134,
}]

const server = http.createServer((req, res) => {
    const hostname = req.headers.host;

    // Define the target ports for different domains
    let targetPort = 0;
    hostList.forEach(host => {
        if (hostname.startsWith(host.domain)) {
            targetPort = host.port
        }
    })

    if (targetPort == 0) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Domain not configured');
        return;
    }

    proxy.web(req, res, { target: `http://localhost:${targetPort}` });

});

server.listen(80);
console.log("Reverse Proxy Server Started")


process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
