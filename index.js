const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const createPdfDocument = require("./pdfGenerator");

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

// Validation middleware
const validateInput = (req, res, next) => {
  const { firstName, lastName, phoneNumber, emailAddress } = req.body;

  // Check if fields are present
  if (!firstName || !lastName || !phoneNumber || !emailAddress) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validation rules
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\+[0-9]{10,12}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return res.status(400).json({
      error: "First and Last names must be strings without special characters",
    });
  }

  if (
    !phoneRegex.test(phoneNumber) ||
    phoneNumber.length < 12 ||
    phoneNumber.length > 14
  ) {
    return res.status(400).json({
      error:
        'Phone number must start with "+" and be between 12 to 14 characters long',
    });
  }

  if (!emailRegex.test(emailAddress)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  next();
};

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
