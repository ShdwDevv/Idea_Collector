// server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require("./firebase"); // Import the db instance from firebase.js

const app = express();

app.use(bodyParser.json());
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
};
app.use(cors(corsOptions));

// Add name to Realtime Database
app.post("/add-name", async (req, res) => {
    const { name } = req.body;
    if (name) {
        try {
            const newNameRef = db.ref("names").push(); // Create a new unique reference
            await newNameRef.set({ name }); // Set the name under the new reference
            res.status(200).send({ message: "Name added successfully" });
        } catch (error) {
            res.status(500).send({ error: "Failed to add name" });
        }
    } else {
        res.status(400).send({ message: "Name is required" });
    }
});

// Get all names from Realtime Database
app.get("/get-names", async (req, res) => {
    try {
        const snapshot = await db.ref("names").once("value"); // Get all names
        const names = [];
        snapshot.forEach((childSnapshot) => {
            names.push(childSnapshot.val().name); // Push each name to the array
        });
        res.json(names);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving names" });
    }
});

// Remove name from Realtime Database
app.post("/remove-name", async (req, res) => {
    const { name } = req.body;
    if (name) {
        try {
            const snapshot = await db.ref("names").once("value"); // Get all names
            let found = false;
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().name === name) {
                    found = true;
                    // Remove the name using its reference
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

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
