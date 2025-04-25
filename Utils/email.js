// const { info } = require("console");
// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   // 1. Create a transporter
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     secure: true,
//     host: "smtp.gmail.com",
//     port: 587,
//     auth: {
//       user: process.env.MY_GMAIL,
//       pass: process.env.MY_GMAIL_KEY,
//     },
//     // host: process.env.EMAIL_USERNAME,
//     // port: process.EMAIL_PORT,
//     // auth: {
//     //   user: process.env.EMAIL_USERNAME,
//     //   pass: process.env.EMAIL_PASSWORD,
//     // },

//     //if using gmail activate less secure app in gmail!
//   });
//   //2.define email options
//   const mailOptions = {
//     from: proces.env.MY_GMAIL,
//     to: "gokulshanthoshm@gmail.com",
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   //3. actually send the email
//   await transporter.sendMail(mailOptions, error, (info) => {
//     if (error) {
//       console.log("Error sending email:", error);
//     } else {
//       console.log("Email sent successfully:", info.response);
//     }
//   });
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true, // Use SSL
      host: "smtp.gmail.com", // Corrected host
      port: 587, // Corrected port for TLS
      auth: {
        user: process.env.MY_GMAIL, // Ensure these are set correctly in your environment
        pass: process.env.MY_GMAIL_KEY,
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: process.env.MY_GMAIL, // Use your email here
      to: options.email, // Use the recipient's email
      subject: options.subject,
      text: options.message,
    };

    // 3. Actually send the email
    const info = await transporter.sendMail(mailOptions); // Await the promise
    console.log("Email sent successfully:", info.response); // Log the response
  } catch (error) {
    console.error("Error sending email:", error); // Log the error
    // Consider throwing the error again, so the caller can handle it
    throw error;
  }
};

// Example usage (for testing):
// if (require.main === module) {
//   require("dotenv").config(); // Load environment variables from .env file

//   const testOptions = {
//     subject: "Test Email from Node.js",
//     message: "This is a test email sent using Node.js and Nodemailer.",
//   };

//   sendEmail(testOptions)
//     .then(() =>
//       console.log("Test email sent successfully (from within the script).")
//     )
//     .catch((error) => console.error("Failed to send test email:", error));
// }

module.exports = sendEmail;
