// https://stackoverflow.com/a/38026580

const fs = require('fs');
const util = require('util');
const stream = require('stream');
const es = require('event-stream');


export default function FileReader() {

}

FileReader.prototype.read = function (pathToFile, callbackLine, callbackEnd) {
  let returnTxt = '';
  const s = fs.createReadStream(pathToFile)
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
      s.pause();

        // console.log('reading line: '+line);
      returnTxt += line;
      callbackLine(line);

        // resume the readstream, possibly from a callback
      s.resume();
    })
    .on('error', () => {
      console.error('Error while reading file.');
    })
    .on('end', () => {
      console.info('Read entire file.');
      callbackEnd(returnTxt);
    }),
);
};

FileReader.prototype.readJSON = function (pathToFile, callback) {
  try {
    this.read(pathToFile, (txt) => { callback(JSON.parse(txt)); });
  } catch (err) {
    throw new Error(`json file is not valid! ${err.stack}`);
  }
};
