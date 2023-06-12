const { log } = require("console");
const express = require("express");
const { readFile } = require("fs/promises");
const { join } = require("path");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Fake server working..." });
});

app.get("/json/:filename", async (req, res) => {
  const { filename } = req.params;
  const { page, size } = req.query;

  try {
    let result = JSON.parse(
      await readFile(join(__dirname, "db", filename + ".json"), {
        encoding: "utf-8",
      })
    );

    result = getSlice(result, page, size);

    res.status(200).json({ result, count: result.length });
  } catch (error) {
    res.status(400).json(error);
  }
});

function getSlice(arr = [], page = 1, size = 10) {
  const startIndex = (page - 1) * size;
  const endIndex = page * size;
  return [...arr].slice(startIndex, endIndex);
}

app.use(express.json());

app.listen(3000, () => {
  log("listening...");
});