require('dotenv').config();
const http = require('http');

const data = JSON.stringify({
  name: 'Juan Perez',
  email: 'juan@test.com',
  password: '12345678',
  status: 'active'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/user',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
