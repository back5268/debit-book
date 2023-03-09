const nodemailer = require('nodemailer');

// Create email queue
let emailQueue = [];
let isEmailSendingAvailable = true;

// Send email function
function sendEmails() {
  setInterval(() => {
    console.log("Starting email sending");

    // Check if email sending is available
    if (isEmailSendingAvailable) {
      isEmailSendingAvailable = false;
      
      // Process each email message in the queue
      while (emailQueue.length) {
        const email = emailQueue.shift();
        console.log("Sending email:", email);
        
        // Send email using nodemailer
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'your_email@gmail.com',
            pass: 'your_email_password'
          }
        });

        let mailOptions = {
          from: 'your_email@gmail.com',
          to: email.to,
          subject: email.subject,
          text: email.text
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }

      // Set email sending available again
      isEmailSendingAvailable = true;
    }
  }, 4000);
}

// Call sendEmails function to start email processing
sendEmails();

// Function to add email message to queue
function sendEmail(to, subject, text) {
  let email = { to, subject, text };
  emailQueue.push(email);
};
