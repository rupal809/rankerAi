const pdfParse = require('pdf-parse');

/**
 * Parse text from a PDF Buffer
 * @param {Buffer} buffer - PDF File Buffer
 * @returns {Promise<string>} - Extracted text
 */
const parsePDF = async (buffer) => {
  try {
    if (!buffer) {
      throw new Error('No buffer provided for PDF parsing.');
    }
    
    const data = await pdfParse(buffer);
    
    // Clean up text slightly (multiple spaces/newlines)
    let text = data.text;
    if (!text || text.trim() === '') {
      throw new Error('PDF parsed text is empty. It might be scanned or image-only.');
    }
    
    // Normalize line endings and white spaces
    text = text.replace(/\r\n/g, '\n').replace(/ {2,}/g, ' ');
    
    return text;
  } catch (error) {
    console.error('Error in pdfService parsePDF:', error.message);
    throw new Error(`PDF Parsing failed: ${error.message}`);
  }
};

module.exports = { parsePDF };
