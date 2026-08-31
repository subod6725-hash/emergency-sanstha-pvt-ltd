const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const root = __dirname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

// ===== USERS (Demo) =====
const users = {
  admin: { username: "admin", password: "1234", role: "admin" },
  customer: { username: "user", password: "1234", role: "customer" }
};

http.createServer((req, res) => {

  // ===== LOGIN API =====
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Admin login
        if (
          data.username === users.admin.username &&
          data.password === users.admin.password
        ) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, role: "admin" }));
        }

        // Customer login
        if (
          data.username === users.customer.username &&
          data.password === users.customer.password
        ) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, role: "customer" }));
        }

        // Invalid login
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false }));

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: "Invalid data" }));
      }
    });

    return; // IMPORTANT
  }

  // ===== FILE SERVER =====
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const normalized = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(root, normalized);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
      return res.end('404 - Page Not Found');
    }

    res.writeHead(200, {
      'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });

    res.end(data);
  });

}).listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
