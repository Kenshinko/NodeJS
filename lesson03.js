const fs = require("fs");
const es = require('event-stream');
const { Transform } = require("stream");

let rowWriteCount = 0;

function sortByIP(IP) {
  const readStream = fs.createReadStream("./access.log", "utf8")
  const writeStream = fs.createWriteStream(`./${IP}_requests.log`, {
      flags: "a",
      encoding: "utf-8",
    })

  const transformStream = new Transform({
    transform(line, encoding, callback) {
      const transformedLine = line
        .toString()
        .match(new RegExp(`^${IP}.*$`, 'gm'));
      callback(null, transformedLine.join("\n"));
      rowWriteCount++;
      console.log(rowWriteCount);
    },
  })

  readStream.pipe(transformStream).pipe(writeStream);
}

const run = () => {
  sortByIP("89.123.1.41");
  sortByIP("34.48.240.111");
}

run();