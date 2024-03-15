const fs = require("fs");
const PDFDocument = require("pdfkit");

// Function to create a PDF document
const createPdfDocument = async (userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = `./${userData.firstName}_${userData.lastName}_document.pdf`;
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Add content to the PDF document
    doc
      .fontSize(20)
      .text("User Information", { align: "center" })
      .moveDown(0.5);
    doc.fontSize(14).text(`First Name: ${userData.firstName}`).moveDown(0.5);
    doc.fontSize(14).text(`Last Name: ${userData.lastName}`).moveDown(0.5);
    doc
      .fontSize(14)
      .text(`Phone Number: ${userData.phoneNumber}`)
      .moveDown(0.5);
    doc
      .fontSize(14)
      .text(`Email Address: ${userData.emailAddress}`)
      .moveDown(0.5);

    doc.end();

    stream.on("finish", () => {
      resolve(pdfPath);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = createPdfDocument;
