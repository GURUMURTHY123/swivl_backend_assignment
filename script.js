const fs = require("fs");
const archiver = require("archiver");

// Path to your Node.js application directory
const appDirectory =
  "/home/workspace/nodejs/coding-assignments/assignment/swivl_backend_assignment";

// Output zip file path
const zipFilePath =
  "/home/workspace/nodejs/coding-assignments/assignment/swivl_backend_assignment/app.zip";

// Create a writable stream to the zip file
const output = fs.createWriteStream(zipFilePath);

// Create an archiver instance
const archive = archiver("zip", {
  zlib: { level: 9 }, // Set compression level (optional)
});

// Pipe the output stream to the archiver
archive.pipe(output);

// Add entire directory to the zip file recursively
archive.directory(appDirectory, false);

// Finalize the zip file
archive.finalize();

// Listen for events (optional)
output.on("close", () => {
  console.log("Zip file created successfully.");
});

archive.on("error", (error) => {
  console.error("Error creating zip file:", error);
});
