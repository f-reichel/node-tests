import http from 'http';
import filereader from 'FileReader';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function printLine(line) {
  console.info(line);
}

function printResult() {

}


const reader = filereader.FileReader(); //  FileReader();
reader.read(outputLog, printLine, printResult);
