/**
 * Google Apps Script for Hamza Khalid Portfolio Contact Form
 * This script receives form submissions and stores them in a Google Sheet
 */

// Configuration
const SHEET_NAME = 'Contact Form Submissions';
const EMAIL_NOTIFICATION = 'thisishamzakhalid@gmail.com'; // Change to your email

/**
 * Main function to handle POST requests from the contact form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Add the submission to the sheet
    addSubmissionToSheet(sheet, data);
    
    // Send email notification (optional)
    sendEmailNotification(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error processing form submission'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Hamza Khalid Portfolio Contact Form API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get existing sheet or create a new one
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Add headers
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Company',
      'Service Interest',
      'Budget',
      'Message',
      'Status'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 120); // Name
    sheet.setColumnWidth(3, 200); // Email
    sheet.setColumnWidth(4, 150); // Company
    sheet.setColumnWidth(5, 180); // Service Interest
    sheet.setColumnWidth(6, 120); // Budget
    sheet.setColumnWidth(7, 300); // Message
    sheet.setColumnWidth(8, 100); // Status
  }
  
  return sheet;
}

/**
 * Add form submission to the sheet
 */
function addSubmissionToSheet(sheet, data) {
  const timestamp = new Date();
  const row = [
    timestamp,
    data.name || '',
    data.email || '',
    data.company || '',
    data.service || '',
    data.budget || '',
    data.message || '',
    'New'
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize the last row
  const lastRow = sheet.getLastRow();
  sheet.autoResizeRow(lastRow);
}

/**
 * Send email notification for new submissions
 */
function sendEmailNotification(data) {
  try {
    const subject = `New Contact Form Submission - ${data.name}`;
    const body = `
New contact form submission received:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Service Interest: ${data.service || 'Not specified'}
Budget: ${data.budget || 'Not specified'}

Message:
${data.message}

Submitted at: ${new Date().toLocaleString()}

---
This email was automatically generated from your portfolio contact form.
    `;
    
    MailApp.sendEmail({
      to: EMAIL_NOTIFICATION,
      subject: subject,
      body: body
    });
    
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Test function to verify the script is working
 */
function testScript() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    service: 'growth-strategy',
    budget: '10k-25k',
    message: 'This is a test submission to verify the script is working correctly.'
  };
  
  const sheet = getOrCreateSheet();
  addSubmissionToSheet(sheet, testData);
  
  console.log('Test submission added successfully');
}

/**
 * Function to get all submissions (for dashboard/reporting)
 */
function getAllSubmissions() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { success: true, data: [] };
    }
    
    const headers = data[0];
    const submissions = data.slice(1).map(row => {
      const submission = {};
      headers.forEach((header, index) => {
        submission[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
      });
      return submission;
    });
    
    return { success: true, data: submissions };
    
  } catch (error) {
    console.error('Error getting submissions:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Function to update submission status
 */
function updateSubmissionStatus(rowIndex, status) {
  try {
    const sheet = getOrCreateSheet();
    const statusColumn = 8; // Status is in column H (8th column)
    
    sheet.getRange(rowIndex + 1, statusColumn).setValue(status);
    
    return { success: true, message: 'Status updated successfully' };
    
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Function to get submission statistics
 */
function getSubmissionStats() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        stats: {
          total: 0,
          thisMonth: 0,
          thisWeek: 0,
          byService: {},
          byStatus: {}
        }
      };
    }
    
    const submissions = data.slice(1);
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: submissions.length,
      thisMonth: 0,
      thisWeek: 0,
      byService: {},
      byStatus: {}
    };
    
    submissions.forEach(row => {
      const timestamp = new Date(row[0]);
      const service = row[4] || 'Not specified';
      const status = row[7] || 'New';
      
      // Count by time period
      if (timestamp >= thisMonth) stats.thisMonth++;
      if (timestamp >= thisWeek) stats.thisWeek++;
      
      // Count by service
      stats.byService[service] = (stats.byService[service] || 0) + 1;
      
      // Count by status
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });
    
    return { success: true, stats };
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return { success: false, error: error.toString() };
  }
}

