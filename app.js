const express = require("express");
const app = express();
var MongoClient = require("mongodb").MongoClient;
var url = require("url");
var urldb = "mongodb://localhost:27017/mydb";
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(urldb, { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
    console.log("conneted successfully");
}).catch((err) => {
    console.log(err);
});


//setting up ejs
app.set("view engine", "ejs");

//setting up templates folder for storing css
app.use(express.static("templates"));

var Schema = mongoose.Schema;

const dataSchema = {
    Name: String,
    city: String,
    State: String,
    Phone_no: String,
    blood_type: String
}

const model = mongoose.model("donor_info", dataSchema);

//routing home page
app.get("/", (req, res) => {
    console.log("this is a get request")
    res.render("home");
});

app.post("/", function(req, res) {
    console.log("this is a post request")
    var newNote = new model({
        Name: req.body.Name,
        city: req.body.City,
        State: req.body.State,
        Phone_no: req.body.Phone_no,
        blood_type: req.body.blood_type
    });
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

            dbo.collection("donor_infos").find(que).toArray(function(err, result) {
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