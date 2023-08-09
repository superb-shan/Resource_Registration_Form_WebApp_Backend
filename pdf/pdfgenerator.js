const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDFBlob = async (data) => {
    const doc = new PDFDocument({ size: 'A4' });

    // Create a buffer to store the PDF content
    const buffers = [];
    doc.on('data', (buffer) => buffers.push(buffer));
    doc.on('end', () => {
        // Combine the buffers into a single buffer
        const pdfBuffer = Buffer.concat(buffers);

        // Convert the buffer to a Blob
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

        // Call a function to send the PDF Blob to the frontend
        sendPDFBlobToFrontend(pdfBlob);
    });

    // Set font
    doc.font('Helvetica');
    const imagePath = path.join(__dirname, 'logo.png');
    doc.image(imagePath, {
        fit: [200, 200], // Set the size of the image
        align: 'right', // Align the image to the right
        valign: 'center', // Vertically center the image
        margin: { top: 150, right: 50 }, // Adjust the margin for image positioning
    });

    // Add text
    doc.fontSize(18).text('PDF with Key-Value Pairs and Image', { align: 'center' });

    // Key-value data


    const lineHeight = 30;
    let y = 150;

    // Add key-value pairs
    doc.fontSize(12).font('Helvetica-Bold');
    for (const key in data) {
        doc.text(`${key}:`, 100, y);
        doc.text(data[key], 200, y);
        y += lineHeight;
    }

    // Add an image

    // Finalize the document and end the stream
    doc.end();
};

const sendPDFBlobToFrontend = (pdfBlob) => {
    // Implement the logic to send the PDF Blob to the frontend here
    // For example, you can use fetch() or a library like axios to send the Blob
    // to a specific endpoint on your frontend.
};

generatePDFBlob({
    'Key 1': 'Value 1',
    'Key 2': 'Value 2',
    'Key 3': 'Value 3',
});
