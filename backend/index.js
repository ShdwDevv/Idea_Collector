const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: ["https://deploy-mern"],
    methods: ["POST", "GET"],
    credentials: true
}));

// MongoDB connection
const uri = 'mongodb+srv://arshathahamed10:<db_password>@cluster0.zcmzg.mongodb.net/namesDB?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Failed to connect to MongoDB Atlas", err));

// Import the Name model (updated path)
const Name = require("./models/Name");

// Endpoint to add a name
app.post("/add-name", async (req, res) => {
    const { name } = req.body;
    if (name) {
        const newName = new Name({ name });
        await newName.save();
        res.status(200).send({ message: "Name added successfully" });
    } else {
        res.status(400).send({ message: "Name is required" });
    }
});

// Endpoint to get all names
app.get("/get-names", async (req, res) => {
    const names = await Name.find();
    res.json(names.map(name => name.name)); // Send only the name field
});

// Endpoint to remove a name
app.post("/remove-name", async (req, res) => {
    const { name } = req.body;
    if (name) {
        const result = await Name.deleteOne({ name: name });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Name removed successfully" });
        } else {
            res.status(404).json({ error: "Name not found" });
        }
    } else {
        res.status(400).json({ error: "Name is required" });
    }
});

// Export the app for Vercel
module.exports = app;