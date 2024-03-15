const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const createPdfDocument = require("./pdfGenerator");
const validateInput = require("./validateInput");

const app = express();

app.use(bodyParser.json());

let db = null;
const dbPath = path.join(__dirname, "./user.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initializeDbAndServer();

// API endpoint to handle user input
app.post("/user", validateInput, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, emailAddress } = req.body;

    // Save data to the database
    const dbQuery = `Insert into user("first_name", "last_name", "phone_number", "email_address") values("${firstName}", "${lastName}", "${phoneNumber}", "${emailAddress}");`;
    const response = await db.run(dbQuery);

    // Generate PDF document
    const pdfPath = await createPdfDocument(req.body);

    // Return document path in response
    res.json({ message: "Data saved successfully", pdfPath });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
});
