//jshint esversion:6
require('dotenv').config();
const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const mySecret = "Thisisourlittlesecret.";

userSchema.plugin(encrypt, { secret: process.env.MY_SECRET, encryptedFields: ["password"] });

const MyUser = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    
    const newUser = new MyUser ({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    });
});

app.post("/login", (req, res) => {

    const userName = req.body.username;
    const userPassword = req.body.password;

    MyUser.findOne({email: userName}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === userPassword) {
                    res.render("secrets");
                }
            }
        }
    })
});


app.listen(3000, () => {
    console.log("Server 3000 OK");
});
