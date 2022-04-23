const express = require("express");
const app = express();
var MongoClient = require("mongodb").MongoClient;
var url = require("url");
var urldb = "mongodb://localhost:27017/";

app.set("view engine", "ejs");

//save all css files in templates folder

app.use(express.static("templates"));
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/search", (req, res) => {
    var q = url.parse(req.url, true);
    var query = q.query;

    if (query.city && query.blood_type) {
        console.log("true");
        MongoClient.connect(urldb, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var que = { blood_type: query.blood_type, city: query.city };
            dbo.collection("donor_info").find(que).toArray(function(err, result) {
                if (err) throw err;
                res.render("search", { variable: result });
                console.log(result);

                db.close();
            });
        });
    } else {
        res.render("search", { variable: " " });
        console.log("false");
    }
});

app.listen(3000, () => console.log("Server Started"));