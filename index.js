var http = require('http');
var fs = require('fs');
var es = require('event-stream');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const winPath = path.normalize('./log/');
console.info(winPath);
const outputLog = winPath + 'LAN-#0.out';
const transformedOutputLog = winPath + 'LAN-#0-transformed.out';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

transformLogFile(outputLog, printResult);

function transformLogFile(pathToFile, callbackEnd) {
    console.info('Start reading file', pathToFile, '...');
    const returnTxt = [];
    const counter = {};

    counter.messageCounter = 0;
    counter.eventCounter = 0;
    counter.infoCounter = 0;
    counter.warnCounter = 0;
    const s = fs.createReadStream(pathToFile)
        .pipe(es.split())
        .pipe(es.mapSync(function(line) {
                // pause the read stream
                s.pause();

                counter.messageCounter += 1;
                if (line.startsWith('** Event')) {
                    counter.eventCounter += 1;
                    line = transformEventLine(line);
                } else if (line.startsWith('INFO')) {
                    counter.infoCounter += 1;
                } else if (line.startsWith('WARN')) {
                    counter.warnCounter += 1;
                }
                returnTxt.push(line);


            // callbackLine(logCounter, line, socket, pathToFile);

                // resume the read stream, possibly from a callback
                s.resume();
            })
                .on('error', function(error) {
                    console.error('Error while reading file.', error);
                })
                .on('end', function() {
                    console.info('Read entire file.');
                    returnTxt.splice(0, 877);
                    callbackEnd(returnTxt, transformedOutputLog);
                })
        );
}

function transformEventLine(input) {
    var array = input.split (" ");
    // console.log(array);
    var sep = ";"
    var line = array[1].toUpperCase() + sep + array[2].slice(1) + sep + array[4].slice(2) + sep + array[10] + sep + array[6].slice(0, -1) + sep + array[11] + ' ' + array[12];
    // console.log('INFO;2;0;LAN.hostB.llc;register_DSAP;Registering higher layer with DSAP=241 on port=1')
    // console.log(line);
    return line;
}

function printLine() {

}

function printResult(result, transformedLog) {
    var file = fs.createWriteStream(transformedLog);
    file.on('error', function(err) {
        console.error('Error writing file', err);
    });
    result.forEach(function(v) { file.write(v + '\n'); });
    file.end();
    console.info('File written successfully');
}
