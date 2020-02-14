const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const actionRouter = require("./routes/action-router");
const projectRouter = require("./routes/project-router");

const server = express();
server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());
server.use(cors());

server.use("/api/projects", logger, projectRouter);
server.use("/api/actions", logger, actionRouter);

server.get("/", logger, (req, res) => {
  res.json({ Welcome: "Its working!!" });
});

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} Request to ${req.originalUrl}`
  );
  next();
}

module.exports = server;
