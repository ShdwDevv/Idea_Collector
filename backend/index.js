const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Use the environment variable for CORS origin
    methods: ["GET", "POST"], // Specify the allowed methods
    credentials: true, // Allow credentials if needed
};
// app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT} PORT`));
mongoose.connect(process.env.MONGODB_URI);
console.log(process.env.MONGODB_URI);
const Name = require("./models/Name");
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
app.get("/get-names", async (req, res) => {
    const names = await Name.find();
    res.json(names.map(name => name.name));
});
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
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
