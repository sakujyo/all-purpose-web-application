//port = 8081; app = (req, res) => { if (req.url == '/t' && req.method == 'GET') { res.writeHeader(200); res.write('<div>Module is listening.</div>'); res.end(); } };
//curl -H "Content-Type: plain/text" -d "port = 8081; app = (req, res) => { if (req.url == '/t' && req.method == 'GET') { res.writeHeader(200); res.write('<div>Module is listening.</div>'); res.end(); } };" http://localhost:8080/load
const http = require('http');
const vm = require('vm');

http.createServer((req, res) => {
	//console.log(req.url);
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
		res.write('<form action="/load" method="POST"><input name="port" placeholder="input port" /><br /><textarea name="app" cols="80" rows="24"></textarea><br /><input type="submit" value="listen" /></form>');
		res.end();
	}
}).listen(process.argv[2]);