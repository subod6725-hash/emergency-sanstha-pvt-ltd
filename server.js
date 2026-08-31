const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const root = __dirname;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript'
};

// ===== REAL USERS (Demo DB) =====
let users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "user", password: "1234", role: "customer" }
];

http.createServer((req, res) => {

  // ===== LOGIN API =====
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);

      const user = users.find(
        u => u.username === data.username && u.password === data.password
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });

      if (user) {
        res.end(JSON.stringify({ success: true, role: user.role }));
      } else {
        res.end(JSON.stringify({ success: false }));
      }
    });

    return;
  }

  // ===== ROOT FIX (IMPORTANT FOR RAILWAY) =====
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(root, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("404 - Not Found");
    }

    res.writeHead(200, {
      'Content-Type': mime[path.extname(filePath)] || 'text/plain'
    });

    res.end(data);
  });

}).listen(port, () => {
  console.log("Server running on port " + port);
});
