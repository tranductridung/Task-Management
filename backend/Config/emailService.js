const nodemailer = require("nodemailer");

// Tạo transporter (dùng Gmail làm ví dụ)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tranductridung0103@gmail.com",
    pass: "ectq nfwi wkfh mrqc",
  },
});

// Hàm gửi email
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

sendEmail(
  "tridung0103@gmail.com",
  "Subject for test email",
  "Content of test email"
);
// module.exports = sendEmail;
