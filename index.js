// Import express
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os')



// Init express 
const app = express();
const port = 8000;


app.get('/hostname', (req, res) => {
  // TODO: cpnvert to json b4 sending
  res.send(JSON.stringify({"hostname":os.hostname()}))
});

app.get('/meminfo', (req, res) => {
  fs.readFile("/proc/meminfo", (err, file_contents) => {
    if (err)
      console.log(err)
    else {
      // Convert file contents to JSON
      // Object.fromEntries - Convert alist of key value pairs to a JS object
      // Converts buffer to utf8 dtring, splits into array of lines and uses array.map to split each line by ":" and then again to trim extra spaces
      json = Object.fromEntries(file_contents.toString('utf8').split("\n").map(s => s.split(":").map(s => s.trim())))
      console.table(json)
      res.contentType('json')
      res.send(json)
    }
  }
  )
});



// Define listener
app.listen(port, () => { console.log("Listening on port " + port) });