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

// ===== USERS =====
let users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "user", password: "1234", role: "customer" }
];

// ===== SESSION =====
let currentUser = null;

http.createServer((req, res) => {

  // LOGIN
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const data = JSON.parse(body);

      const user = users.find(
        u => u.username === data.username && u.password === data.password
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });

      if (user) {
        currentUser = user;
        res.end(JSON.stringify({ success: true, role: user.role }));
      } else {
        res.end(JSON.stringify({ success: false }));
      }
    });

    return;
  }

  // LOGOUT
  if (req.method === 'POST' && req.url === '/logout') {
    currentUser = null;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // ROOT FIX
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
