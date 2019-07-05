const RedisServer = require('redis-server');

const server = new RedisServer(6379);

server.open(error => {
  if (error) { console.log(`Unable to start Redis: ${ error.message }`); process.exit(1) }
  else console.log('Redis is running on port 6379')
});
