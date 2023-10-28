import nodemailer from 'nodemailer';

const sendEmails = async (sender) => {
  // Configure Nodemailer with your Gmail credentials
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'hkesh2721@gmail.com', // Your Gmail email address
      pass: 'wpif vphz arjt pwvj',  // Your Gmail password or app-specific password
    },
  });

  // Compose the vacation response email
  const mailOptions = {
    from: 'hkesh2721@gmail.com',  // Your Gmail email address
    to:`${sender}`,
    subject: 'Out of Office: Vacation Response',
    text: 'Thank you for your email. I am currently out of the office on vacation and will respond to your message when I return.',
  };

  // Send vacation response emails to each email ID
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending response to email ID', sender, ':', error);
    } else {
      console.log('Response sent to email ID', sender, ':', info.response);
    }
  });
};

export default sendEmails;
