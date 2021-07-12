const http = require('http');
const vm = require('vm');

http.createServer((req, res) => {
	if (req.url == '/load' && req.method == 'POST') {
		let data = '';
		req.on('data', chunk => {
			data += chunk;
		});
		req.on('end', () => {
			const params = new URLSearchParams(data);
			const script = new vm.Script(`port = ${params.get('port')};app = ${params.get('app')}`);
			const context = {};
			vm.createContext(context);
			script.runInContext(context);
			console.log(`context.app: ${context.app}`);
			http.createServer(context.app).listen(context.port);
		});
		res.end();
	}
	if (req.url == '/listen' && req.method == 'GET') {
		res.writeHeader(200, { 'Content-Type': 'text/html' });
		res.write('<style>* { font: 14pt Consolas; } textarea { width: 100%; }</style><form action="/load" method="POST"><input name="port" placeholder="port" /><br /><textarea name="app" rows="24" wrap="off" placeholder="code"></textarea><br /><input type="submit" value="listen" /></form>');
		res.end();
	}
}).listen(process.argv[2]);
