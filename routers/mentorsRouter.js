const express = require("express");
const mongo = require("mongodb");

const mentorsRouter = express.Router();

const mongoClient = mongo.MongoClient;
const mongoUrl =
  "mongodb+srv://admin:testing1@cluster1.gfegd.mongodb.net/assign_mentor?retryWrites=true&w=majority";

mongoClient.connect(mongoUrl, function (err, db) {
  if (err) throw err;
  let dbo = db.db("assign_mentor");
  dbo.collection("data", (err) => {
    if (err) throw err;
  });

  mentorsRouter
    .post("/", (req, res) => {
      if (!req.body.isStudent) {
        if (req.body.mentor.name && typeof req.body.mentor.name == "string") {
          req.body.mentor.id = generateID();
          dbo.collection("data").insertOne(req.body, (err, res) => {
            if (err) throw err;
          });
        }
      }
      res.send("Mentor created.");
    })
    .get("/", (req, res) => {
      dbo
        .collection("data")
        .find({ isStudent: false })
        .toArray((err, response) => {
          if (err) throw err;
          res.status(200).send(response);
        });
    })
    .get("/:id", (req, res) => {
      dbo
        .collection("data")
        .findOne({ "mentor.id": +req.params.id }, (err, response) => {
          if (err) throw err;
          res.status(200).send(response);
        });
    })
    .patch("/:id", (req, res) => {
      dbo.collection("data").updateOne(
        { "mentor.id": +req.params.id },
        {
          $push: {
            "mentor.students": req.body.student,
          },
        },
        (err, response) => {
          if (err) throw err;
          res.send("Mentor updated");
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
  //db.close();
});

module.exports = mentorsRouter;
