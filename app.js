const express = require("express");
const app = express();
var MongoClient = require("mongodb").MongoClient;
var url = require("url");
var urldb = "mongodb://localhost:27017/";

//setting up ejs
app.set("view engine", "ejs");

//setting up templates folder for storing css
app.use(express.static("templates"));

//routing home page
app.get("/", (req, res) => {
    res.render("home");
});

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

                //passing all the filtered queries to our html page in the form of variable "data"
                res.render("search", { data: result });
                db.close();
            });
        });
    }

    //if there is no quert, then render as it is 
    else {
        res.render("search", { data: " " });
    }
});

app.listen(3000, () => console.log("Server Started"));