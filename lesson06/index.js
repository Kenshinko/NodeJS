const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

let counter = 0;

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "./index.html");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);

io.on("connection", (client) => {
  const username = client.id.substr(0, 5);
  counter++;

  console.log(`User ${username} has connected.`);

  client.on("disconnect", (client) => {
    console.log(`User ${username} has disconnected.`);
    counter--;
  });

  client.on("newMessage", (data) => {
    console.log(data);

    client.broadcast.emit("newMessage", data);
    client.emit("newMessage", data);
  });

  client.on('getCounter', (callback) => {
    console.log(`Users ${counter}`);

    client.broadcast.emit("getCounter", callback(null, counter));
    client.emit("getCounter", callback(null, counter));
  });
});

server.listen(5500);