const nodemailer = require('nodemailer');

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
                    service: "gmail",
                    auth: {
                        user: process.env.AUTH_EMAIL,
                        pass: process.env.AUTH_PASS,
                    }
                });

                let mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email.to,
                    subject: email.subject,
                    html: email.html,
                };

                transporter.sendMail(mailOptions, function (error, info) {
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
};

function addEmailToQueue(mailOptions) {
    emailQueue.push(mailOptions);
};

module.exports = { addEmailToQueue, sendEmails };