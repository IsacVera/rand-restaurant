const http = require("http");
const url = require("url");
const fs = require("fs");
const dotenv = require("dotenv");

require('dotenv').config()

const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);

    let path = parsedUrl.path.replace(/^\/+|\/+$/g, "");

    if (path == "api/mapbox-key") {
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(JSON.stringify({ token: process.env.KEY }));
        return;
    }

    if (path == "") {
        path = "index.html";
    }

    let file = __dirname + "/public/" + path;

    fs.readFile(file, function(err, content) {
        if (err) {
            console.log(`File not found: ${file}`);
            res.writeHead(404);
            res.end();
        } else {
            res.setHeader("X-Content-Type-Options", "nosniff");
            switch(path) {
                case "style.css":
                    res.writeHead(200, {"Content-type": "text/css"});
                    break;
                case "app.js":
                    res.writeHead(200, {"Content-type": "text/javascript"});
                    break;
                case "index.html":
                    res.writeHead(200, {"Content-type": "text/html"});
            }
            res.end(content);
        }
    });
})

server.listen(3000, "localhost", () => {
    console.log("Listening on port 3000");
    console.log("http://localhost:3000/");
});
