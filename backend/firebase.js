const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json"); // Replace with the path to your service account key
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL, // Ensure this is set
});
const db = admin.database(); // Get the Realtime Database reference
module.exports = { db }; // Export the database instance