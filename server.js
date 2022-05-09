const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8005;

const storedNotes = require('./db/db.json');

//middleware

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// serve db notes to front end
app.get('/api/notes', (req, res) => res.json(storedNotes));

//serve html directories to front end
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//route to read db json file notes to front end
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  storedNotes.push(newNote);


  
 fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
    res.json(storedNotes);
    console.log(storedNotes);



});


//server listener
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);