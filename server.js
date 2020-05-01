const express = require("express");
const path = require("path");
const uuid = require("uuid/v4");
const util = require("util");
const fs = require("fs");

const app = express();
const PORT = 3000;


app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const readFileAsync = util.promisify(fs.readFile);

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", 'utf8', function(err, data) {
        if(err) throw err;
        const newNote = JSON.parse(data);
        
        // console.log(newNote + "line 28");
        res.json(newNote);
        
    })

});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.post("/api/notes", function(req, res) {
    const note = req.body;
    const { title, text } = note;
    
    const id =  uuid();
    const newNote = { title, text, id }
    let oldNotes;

    console.log(newNote);
    fs.readFile("./db/db.json", function(err, data) {
            console.log(data + "Line 50");
           
            oldNotes = JSON.parse(data);
            notesArr(oldNotes);
            console.log(oldNotes + "Line 53");
    })
    return oldNotes;
            
    function notesArr (oldNotes) {
        const notesArray = [].concat(oldNotes, newNote);
        fs.writeFileSync("./db/db.json", JSON.stringify(notesArray));
        res.redirect("/notes");
    }


});

app.delete("/api/notes/:id", function(req, res) {
    // console.log(req.params.id);
    fs.readFile("./db/db.json", function(err, data) {
        const noteArr = JSON.parse(data);
        const filteredArr = noteArr.filter(function (n) {
            return n.id != req.params.id;
        })
        fs.writeFileSync("./db/db.json", JSON.stringify(filteredArr));
        res.json({ ok: true });
    })
    
})

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});