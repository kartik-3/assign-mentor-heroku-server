const express = require("express");
const mongo = require("mongodb");

const studentsRouter = express.Router();

const mongoUrl =
  "mongodb+srv://admin:testing1@cluster1.gfegd.mongodb.net/assign_mentor?retryWrites=true&w=majority";

const mongoClient = mongo.MongoClient;

mongoClient.connect(mongoUrl, function (err, db) {
  if (err) throw err;
  let dbo = db.db("assign_mentor");

  studentsRouter
    .post("/", (req, res) => {
      if (req.body.isStudent) {
        if (req.body.student.name && typeof req.body.student.name == "string") {
          req.body.student.id = generateID();
          dbo.collection("data").insertOne(req.body, (err, res) => {
            if (err) throw err;
          });
        }
      }
      res.send("Created student.");
    })
    .get("/", (req, res) => {
      dbo
        .collection("data")
        .find({ isStudent: true })
        .toArray((err, response) => {
          if (err) throw err;
          res.status(200).send(response);
        });
    })
    .get("/:id", (req, res) => {
      dbo
        .collection("data")
        .findOne({ "student.id": +req.params.id }, (err, response) => {
          if (err) throw err;
          res.status(200).send(response);
        });
    })
    .patch("/:id", (req, res) => {
      dbo.collection("data").updateOne(
        { "student.id": +req.params.id },
        {
          $set: {
            "student.isMentorAssigned": req.body.isMentorAssigned,
            "student.mentorName": req.body.mentorName,
          },
        },
        (err, response) => {
          if (err) throw err;
          res.send("Student updated");
        }
      );
    });

  const generateID = () => {
    const currId = Math.floor(Math.random() * 900 + 100);
    dbo.collection("data").findOne({ id: currId }, (err, res) => {
      if (err) throw err;
      if (res != null) {
        generateID();
      }
    });
    return currId;
  };
  // db.close();
});
module.exports = studentsRouter;
