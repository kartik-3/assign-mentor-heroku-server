const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const studentsRouter = require("./routers/studentsRouter");
const mentorsRouter = require("./routers/mentorsRouter");

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use("/students", studentsRouter)
  .use("/mentors", mentorsRouter)
  .listen(process.env.PORT);
