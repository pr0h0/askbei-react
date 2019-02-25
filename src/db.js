const fs = require("fs");
const url = require("url");
const path = require("path");

function readFile() {
  return new Promise(g => {
    let data = fs.readFileSync(
      new url.URL(path.join("file://", __dirname, "data.json"))
    );
    g(JSON.parse(data.toString()));
  });
}

function save(data) {
  fs.writeFile(
    new url.URL(path.join("file://", __dirname, "data.json")),
    JSON.stringify(data),
    err => {
      if (err) console.log(err);
    }
  );
}

var db = {
  read: readFile,
  write: save
};
module.exports = db;
