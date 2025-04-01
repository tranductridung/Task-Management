const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tranductridung0103@gmail.com",
    pass: "ectq nfwi wkfh mrqc",
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = sendEmail;
