// server.js
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { getDate } = require("./modules/utils");

// Load language file
const lang = require("./locals/en.json");

// Request handler class
class RequestHandler {
  constructor() {
    this.basePath = path.join(__dirname);
  }

  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Set response header
    res.setHeader("Content-Type", "text/html");

    if (pathname === "/") {
      // Serve home page
      this.handleHomePage(res);
    } else if (pathname === "/COMP4537/labs/3/getDate") {
      this.handleGetDate(query, res);
    } else if (pathname === "/COMP4537/labs/3/writeFile") {
      this.handleWriteFile(query, res);
    } else if (pathname.startsWith("/COMP4537/labs/3/readFile")) {
      this.handleReadFile(pathname, res);
    } else {
      this.handleNotFound(res);
    }
  }

  handleHomePage(res) {
    const filePath = path.join(this.basePath, "public", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('<div style="color: red;">Error loading home page.</div>');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  }

  handleGetDate(query, res) {
    const name = query.name;
    if (!name) {
      res.statusCode = 400;
      res.end('<div style="color: red;">Name parameter is required.</div>');
    } else {
      const currentDate = getDate();
      const message = `<div style="color: blue;">Hello ${name}, What a beautiful day. Server current date and time is ${currentDate}</div>`;
      res.statusCode = 200;
      res.end(message);
    }
  }

  handleWriteFile(query, res) {
    const text = query.text;
    if (!text) {
      res.statusCode = 400;
      res.end('<div style="color: red;">Text parameter is required.</div>');
    } else {
      const filePath = path.join(this.basePath, "file.txt");
      fs.appendFile(filePath, `${text}\n`, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('<div style="color: red;">Error writing to file.</div>');
        } else {
          res.statusCode = 200;
          res.end(`Text appended: ${text}`);
        }
      });
    }
  }

  handleReadFile(pathname, res) {
    const fileName = path.basename(pathname);
    const filePath = path.join(this.basePath, fileName);

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end(
        `<div style="color: red;">Error 404: File ${fileName} not found.</div>`
      );
    } else {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('<div style="color: red;">Error reading file.</div>');
        } else {
          res.statusCode = 200;
          res.end(`<pre>${data}</pre>`);
        }
      });
    }
  }

  handleNotFound(res) {
    res.statusCode = 404;
    res.end('<div style="color: red;">Error 404: Page not found.</div>');
  }
}

// Server class
class Server {
  constructor(port) {
    this.port = port;
    this.requestHandler = new RequestHandler();
  }

  start() {
    const server = http.createServer((req, res) => {
      this.requestHandler.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

// Instantiate and start the server
const server = new Server(3000);
server.start();
