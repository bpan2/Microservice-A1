
var plugin = function (options) {
    var seneca = this;
    seneca.add({ role: 'product', cmd: 'add' }, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'product', cmd: 'get' }, function (msg, respond) {
        this.make('product').load$(msg.data.product_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all' }, function (msg, respond) {
        this.make('product').list$({}, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete' }, function (msg, respond) {
        this.make('product').remove$(msg.data.product_id, respond);
    });
}

module.exports = plugin;


var http = require('http');
fs = require('fs')

fs.readFile('package.json', 'utf8', function(err, data){
if (err){
	return console.log(err);
	}
console.log(data);
});


var server = http.createServer (function (request, response) {
        response.writeHead (200, {"Content-Type": "text/plain"});
        response.end("Hello World\n");
});
server.listen (8000, '127.0.0.1'); 