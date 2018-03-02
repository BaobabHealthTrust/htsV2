const RedisServer = require('redis-server');

// Simply pass the port that you want a Redis server to listen on.
const server = new RedisServer(6379);

server.open((err) => {
  if (err === null) {
    // You may now connect a client to the Redis server bound to `server.port` (e.g.
    // 6379).

    console.log("Redis running on port 6379");

  } else {

    console.log(err);

  }
});
