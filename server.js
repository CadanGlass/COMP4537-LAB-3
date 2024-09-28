// server.js
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { getDate } = require("./modules/utils");

// Load language file
const lang = require("./locals/en.json");

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set response header
  res.setHeader("Content-Type", "text/html");

  if (pathname === "/COMP4537/labs/3/getDate") {
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
  } else if (pathname === "/COMP4537/labs/3/writeFile") {
    const text = query.text;
    if (!text) {
      res.statusCode = 400;
      res.end('<div style="color: red;">Text parameter is required.</div>');
    } else {
      const filePath = path.join(__dirname, "file.txt");
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
  } else if (pathname.startsWith("/COMP4537/labs/3/readFile")) {
    const fileName = path.basename(pathname);
    const filePath = path.join(__dirname, fileName);

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
  } else {
    res.statusCode = 404;
    res.end('<div style="color: red;">Error 404: Page not found.</div>');
  }
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
