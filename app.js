const express = require("express");
const app = express();
var MongoClient = require("mongodb").MongoClient;
var url = require("url");
var urldb = "mongodb://localhost:27017/";
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const internal = require("stream");

//setting up ejs
app.set("view engine", "ejs");

//setting up templates folder for storing css
app.use(express.static("templates"));

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(urldb, { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
    console.log("conneted successfully");
}).catch((err) => {
    console.log(err);
});
const dataSchema = {
    Name: String,
    City: String,
    State: String,
    Phone_no: String,
    blood_type: String
}

const data = mongoose.model("mydb", dataSchema);

//routing home page
app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", function(req, res) {
    let newNote = new data({
        Name: req.body.Name,
        State: req.body.State,
        City: req.body.City,
        Phone_no: req.body.Phone_no,
        Blood_type: req.body.Blood_type
    });
    console.log(newNote);
    newNote.save().then(() => console.log("saved succesfully"));
    res.redirect('/');
})

//routing search page
app.get("/search", (req, res) => {

    //parsing url to get the query 
    var q = url.parse(req.url, true);
    var query = q.query;

    // using query to filter results from database
    if (query.city && query.blood_type) {
        MongoClient.connect(urldb, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var que = { blood_type: query.blood_type, city: query.city };

            dbo.collection("donor_info").find(que).toArray(function(err, result) {
                if (err) throw err;

                //passing all the filtered queries to our html page in the form of variable "array"
                res.render("search", { values: result });
                db.close();
            });
        });
    }

    //if there is no quert, then render as it is 
    else {
        res.render("search", { values: " " });
    }
});

app.listen(3000, () => console.log("Server Started"));