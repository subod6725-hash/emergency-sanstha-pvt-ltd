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

http.createServer((req, res) => {

  // ===== LOGIN =====
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);

      if (data.username === 'admin' && data.password === '1234') {

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': 'auth=admin; HttpOnly'
        });

        return res.end(JSON.stringify({ success: true }));
      }

      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false }));
    });

    return;
  }

  // ===== LOGOUT =====
  if (req.method === 'POST' && req.url === '/logout') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth=; Max-Age=0'
    });

    return res.end(JSON.stringify({ success: true }));
  }

  // ===== CHECK AUTH =====
  if (req.method === 'GET' && req.url === '/check-auth') {

    const cookie = req.headers.cookie || '';

    if (cookie.includes('auth=admin')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ loggedIn: true }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ loggedIn: false }));
  }

  // ===== STATIC FILE =====
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(root, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('404 Not Found');
    }

    res.writeHead(200, {
      'Content-Type': mime[path.extname(filePath)] || 'text/plain'
    });

    res.end(data);
  });

}).listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
