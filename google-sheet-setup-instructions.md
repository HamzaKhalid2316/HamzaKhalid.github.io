# Google Sheet Integration Setup Instructions

## Overview
This guide will help you set up Google Apps Script to automatically collect contact form submissions from your portfolio website into a Google Sheet.

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Rename the spreadsheet to "Hamza Khalid Portfolio - Contact Forms"
4. Note the spreadsheet URL - you'll need the ID later

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the script editor
3. Copy and paste the entire content from `google-apps-script.js` into the script editor
4. Save the project (Ctrl+S or Cmd+S)
5. Rename the project to "Portfolio Contact Form Handler"

## Step 3: Configure the Script

1. In the script, update the `EMAIL_NOTIFICATION` variable with your actual email address:
   ```javascript
   const EMAIL_NOTIFICATION = 'your-actual-email@gmail.com';
   ```

## Step 4: Deploy the Script as a Web App

1. Click the **Deploy** button (top right)
2. Choose **New deployment**
3. Click the gear icon next to "Type" and select **Web app**
4. Fill in the deployment settings:
   - **Description**: "Portfolio Contact Form API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click **Deploy**
6. **Important**: Copy the Web App URL - you'll need this for your website

## Step 5: Grant Permissions

1. When prompted, click **Authorize access**
2. Choose your Google account
3. Click **Advanced** if you see a warning
4. Click **Go to Portfolio Contact Form Handler (unsafe)**
5. Click **Allow** to grant the necessary permissions

## Step 6: Test the Script

1. In the Apps Script editor, select the `testScript` function from the dropdown
2. Click the **Run** button
3. Check your Google Sheet - you should see a test submission added
4. Check your email for a notification

## Step 7: Update Your Website

Replace the contact form submission code in your `index.html` with the following:

```javascript
// Contact form submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    
    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        // Send data to Google Apps Script
        const response = await fetch('YOUR_WEB_APP_URL_HERE', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Thank you for your message! I\'ll get back to you within 24 hours.');
            this.reset();
        } else {
            throw new Error(result.message || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error sending your message. Please try again or contact me directly at hamza@hamzakhalid.me');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});
```

**Important**: Replace `YOUR_WEB_APP_URL_HERE` with the actual Web App URL you copied in Step 4.

## Step 8: Set Up Email Notifications (Optional)

The script automatically sends email notifications to the address specified in `EMAIL_NOTIFICATION`. To customize the email format:

1. Edit the `sendEmailNotification` function in the Apps Script
2. Modify the `subject` and `body` variables as needed
3. Save and redeploy if necessary

## Step 9: Monitor Submissions

### View Submissions
- All form submissions will appear in your Google Sheet automatically
- Each submission includes timestamp, contact details, and message
- You can sort, filter, and analyze the data as needed

### Submission Statistics
You can run the `getSubmissionStats()` function to get analytics:
1. In Apps Script, select `getSubmissionStats` from the function dropdown
2. Click **Run**
3. Check the execution log for statistics

### Update Submission Status
To track your follow-up progress:
1. Manually update the "Status" column in the sheet (e.g., "Contacted", "Proposal Sent", "Closed")
2. Or use the `updateSubmissionStatus(rowIndex, status)` function

## Troubleshooting

### Common Issues:

1. **"Script function not found" error**
   - Make sure you've saved the script after pasting the code
   - Verify the function names match exactly

2. **Permission denied errors**
   - Re-run the authorization process
   - Make sure you've granted all necessary permissions

3. **Form submissions not appearing**
   - Check that you've updated the Web App URL in your website code
   - Verify the deployment is set to "Anyone" access
   - Check the Apps Script execution log for errors

4. **Email notifications not working**
   - Verify your email address is correct in the script
   - Check your spam folder
   - Ensure Gmail API permissions are granted

### Testing the Integration:

1. Submit a test form on your website
2. Check the Google Sheet for the new entry
3. Verify you received an email notification
4. Check the Apps Script execution log for any errors

## Security Considerations

- The Web App URL should be kept secure (though it's designed to be publicly accessible)
- Consider implementing rate limiting if you experience spam
- Regularly review submissions and clean up test data
- Monitor the Apps Script execution quota to ensure it doesn't exceed limits

## Advanced Features

### Custom Validation
You can add server-side validation by modifying the `doPost` function:

```javascript
// Add validation
if (!data.name || !data.email || !data.message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      message: 'Required fields are missing'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Webhook Integration
You can extend the script to send data to other services (CRM, Slack, etc.) by adding webhook calls in the `doPost` function.

### Auto-Response Emails
You can set up automatic response emails to form submitters by adding code to send emails to `data.email`.

## Support

If you encounter any issues with this setup:
1. Check the Apps Script execution log for detailed error messages
2. Verify all URLs and permissions are correct
3. Test each component individually (script functions, form submission, etc.)

The Google Apps Script will handle all form submissions automatically once properly configured, providing you with organized data collection and email notifications for new inquiries.

