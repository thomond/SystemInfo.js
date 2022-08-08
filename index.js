// Import express
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os')
const sysinfo = require('systeminformation')



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

// Define commands as Object literal
const cmds = {
      cpu: (res) => {
        sysinfo.cpu()
        .then(data => res.send(data))
        .catch(error => console.error(error)) 
      },
      memory: 'memory',
      default: () => res.send('Nothing Defined')
    }

app.get('/:cmd?', (req, res) => {
  console.time("request")
  const cmd = req.params.cmd

  switch(cmd){
    
    case 'cpu':
      sysinfo.cpu()
      .then(data => res.send(data))
      .catch(error => console.error(error));
    break
    default:
      res.send('Nothing Defined')
    break
  }
  console.timeEnd("request")
});

// Define listener
app.listen(port, () => { console.log("Listening on port " + port) });