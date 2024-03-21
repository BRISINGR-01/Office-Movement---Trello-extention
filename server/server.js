const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const EventDispatcher = require("./eventDispatcher");
var ip = require("ip");

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "data.json");
const eventDispatcher = new EventDispatcher("/subscribe");

app.use((req, res, next) => {
  console.log("Got request from: " + req.ip);
  console.log("With params: " + JSON.stringify(req.query));
  next();
});

app.use("/img", (req, res) => {
  const filePath = path.join(__dirname, "image-20240321-101624-5f538e2c.jpeg");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Set the appropriate content type for JPEG
    res.setHeader("Content-Type", "image/jpeg");

    // Send the image data in the response
    res.send(data);
  });
});

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

let tasks = [
  "Go to red ball",
  "Go to blue ball",
  "Go to green ball",
  "Walk 5 meters",
  "Walk 10 meters",
  "Walk 20 meters",
];

let randomTask = tasks[Math.floor(Math.random() * tasks.length)];

app.get("/data", (req, res) => {
  try {
    let data = readData();
    const id = parseInt(req.query.id, 10);
    let item = data.find((i) => i.id === id);

    if (!item) {
      item = { id: id, done: false, task: randomTask };
      data.push(item);
      writeData(data);
    }
    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/data", (req, res) => {
  let data = readData();
  const id = parseInt(req.query.id, 10);
  let item = data.find((i) => i.id === id);

  if (item) {
    item.done = true;
    eventDispatcher.dispatch(id);
    writeData(data);
    res.send(item);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/lock/", (req, res) => {
  let data = readData();
  const id = parseInt(req.query.id, 10);
  let item = data.find((i) => i.id === id);

  if (item) {
    item.done = false;
    writeData(data);
    res.send(item);
  } else {
    res.status(404).send("Not Found");
  }
});

app.get("/subscribe", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });

  let counter = 0;

  // Send a message on connection
  res.write("event: connected\n");
  res.write(`data: You are now subscribed!\n`);
  res.write(`id: ${counter}\n\n`);
  counter += 1;

  // Send a subsequent message every five seconds
  eventDispatcher.subscribe((id) => {
    res.write("event: message\n");
    res.write(`data: ${id}\n`);
    res.write(`id: ${counter}\n\n`);
    counter += 1;
  });

  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));
});

app.listen(3000, () => console.log(ip.address() + ":3000"));
