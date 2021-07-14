const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;
const pubFolder = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.json());

app.get("/notes", function(req, res) {

    res.sendFile(path.join(pubFolder, "notes.html"));
});

app.get("/api/notes", function(req, res) {

    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {

    let saved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(saved[Number(req.params.id)]);
    
});

app.get("*", function(req, res) {
    res.sendFile(path.join(pubFolder, "index.html"));
});

app.post("/api/notes", function(req, res) {

    let saved = JSON.parse(fs.readFileSync("./db/db.json"));
    let newNote = req.body;
    let noteName = (saved.length).toString();
    newNote.id = noteName;
    saved.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(saved));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(saved);

})

app.delete("/api/notes/:id", function(req, res) {

    let saved = JSON.parse(fs.readFileSync("./db/db.json"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    saved = saved.filter(activeNote => {
        return activeNote.id != noteID;
    })
    
    for (activeNote of saved) {
        activeNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(saved));
    res.json(saved);
})

app.listen(port, function() {
    console.log(`Now listening to port ${port}`);
})