const dotenv = require("dotenv");
dotenv.config({path:"./.env"});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require("./firebase"); // Import the db instance from firebase.js
const app = express();
// Middleware
app.use(bodyParser.json());
const headers = {'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
// const response = {
//     statusCode: 200,
//     headers:headers,
//     body: JSON.stringify(X),
// };
// return response;
// const corsOptions = {
//     origin: '*',
//     methods: ["GET", "POST"],
//     credentials: true,
//     optionSuccessStatus:200,

// };
// app.use(cors(corsOptions));
// console.log(corsOptions.origin)
// Add name to Realtime Database
app.post("/add-name", async (req, res) => {
    const { name } = req.body;
    res.set(headers); // Set headers for this response
    if (name) {
        try {
            const newNameRef = db.ref("names").push();
            await newNameRef.set({ name });
            res.status(200).send({ message: "Name added successfully" });
        } catch (error) {
            res.status(500).send({ error: "Failed to add name" });
        }
    } else {
        res.status(400).send({ message: "Name is required" });
    }
});

app.get("/get-names", async (req, res) => {
    res.set(headers); // Set headers for this response
    try {
        const snapshot = await db.ref("names").once("value");
        const names = [];
        snapshot.forEach((childSnapshot) => {
            names.push(childSnapshot.val().name);
        });
        res.json(names);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving names" });
    }
});

app.post("/remove-name", async (req, res) => {
    const { name } = req.body;
    res.set(headers); // Set headers for this response
    if (name) {
        try {
            const snapshot = await db.ref("names").once("value");
            let found = false;
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().name === name) {
                    found = true;
                    db.ref("names").child(childSnapshot.key).remove();
                }
            });
            if (found) {
                res.status(200).json({ message: "Name removed successfully" });
            } else {
                res.status(404).json({ error: "Name not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error removing name" });
        }
    } else {
        res.status(400).json({ error: "Name is required" });
    }
});