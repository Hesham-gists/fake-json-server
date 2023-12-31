require("dotenv").config();
const { log } = require("console");
const express = require("express");
const cors = require("cors");
const { readFile } = require("fs/promises");
const { join } = require("path");

const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:4200"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Fake server working..." });
});

app.get("/json/:filename", async (req, res) => {
  const { filename } = req.params;
  const { page, size, userId, sort } = req.query;

  try {
    let result = JSON.parse(
      await readFile(join(__dirname, "db", filename + ".json"), {
        encoding: "utf-8",
      })
    );

    result = sortWithDate(result, sort);
    result = getSlice(result, page, size);
    result = getByUserId(result, userId);

    res.status(200).json({ result, count: result.length });
  } catch (error) {
    res.status(400).json(error);
  }
});

function sortWithDate(arr = [], sort) {
  if (!sort) return [...arr];
  return [...arr].sort((a, b) => {
    if (sort === "asc") {
      return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime();
    } else {
      return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime();
    }
  });
}

function getSlice(arr = [], page = 1, size = 10) {
  const startIndex = (page - 1) * size;
  const endIndex = page * size;
  return [...arr].slice(startIndex, endIndex);
}

function getByUserId(arr = [], id) {
  if (!id) return [...arr];
  return [...arr].filter((i) => i.userId === +id);
}

app.listen(process.env.PORT || 3000, () => {
  log("listening...");
});
