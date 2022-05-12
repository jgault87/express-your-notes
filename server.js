const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();

//use heroku env port or 8005
const PORT = process.env.PORT || 8005;

let storedNotes = require("./db/db.json");

//middleware

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//serve html directories to front end
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//route to read db json file notes to front end
app.get("/api/notes", (req, res) => res.json(storedNotes));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//display note selected based on ID
app.get("/api/notes/:id", (req, res) => {
  res.json(notes[req.params.id]);
});

//click save button to send post request and push newnote to stored notes obj

app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  newNote.id = Math.floor(Math.random() * 9001); /* rudimentary id assignment for get/delete individual notes*/
  storedNotes.push(newNote);

  // read || create json file and newNote obj
  fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
  res.json(storedNotes);
  console.log(storedNotes);
});

// delete path targeting individual note ID
app.delete("/api/notes/:id", (req, res) => {
  let noteId = req.params.id;

  //filter notes that do not have a matching ID
  storedNotes = storedNotes.filter((selected) => {
    return selected.id != noteId;
  });

  //write the filtered notes to db json and display updated stored notes
  fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
  console.log(`deleted note ID: ${noteId}`);
  res.json(storedNotes);
});

//server listener
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
