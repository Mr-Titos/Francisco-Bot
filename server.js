var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('Site_Titos/work-grid.html',function (err,data) {
    res.end(data);
});
}).listen(8080);