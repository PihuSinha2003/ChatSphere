import http from 'http';

http.createServer((req, res) => {
  res.end('Welcome to ChatSphere');
}).listen(3000);

console.log('Server is running at http://localhost:3000');
