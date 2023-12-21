import express from 'express';
import mysql from 'mysql2'; // Import mysql2 instead of mysql
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = 3000;

// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'bhrs96ubdnkhowlpmxrh-mysql.services.clever-cloud.com',
  user: 'u0malzlowdqkyc6o',
  password: '8mr61C4ArlkhXSxccG5T',
  database: 'bhrs96ubdnkhowlpmxrh',
  multipleStatements: true // Enable multiple statements if needed
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jaysitima@gmail.com', // Replace with your Gmail email address
    pass: 'bowe ahya zvnb duqv', // Replace with your Gmail password
  },
});

// Enable CORS for all routes
app.use(cors());

// Express middleware to parse incoming JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handle form submissions
app.post('/store-data', (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://luxury-cactus-f1d281.netlify.app/'); // Replace with your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Retrieve form data
  const { name, email, phone, date, department, message } = req.body;

  console.log('Received Form Data:', { name, email, phone, date, department, message });

  // Sending email using Nodemailer
  const mailOptions = {
    from: 'jaysitima@gmail.com', // Replace with your Gmail email address
    to: 'jaysitima@gmail.com', // Replace with the recipient's email address
    subject: 'New Appointment',
    html: `
      <h1>New Appointment Information</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Department:</strong> ${department}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // You may handle errors related to sending email here
    } else {
      console.log('Email sent:', info.response);
      // You can log or handle successful email sending here
    }
  });

  // Insert form data into MySQL database using prepared statements
  const sql = 'INSERT INTO appointments (name, email, phone, appointment_date, department, message) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, date, department, message], (err, result) => {
    if (err) {
      console.error('Error storing data in the database:', err);
      return res.status(500).send('Error storing data in the database'); // Send an error response
    }

    console.log('Data stored successfully in the database');
    return res.status(200).send('Form submitted successfully'); // Send a success response
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});