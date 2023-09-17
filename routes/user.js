const express = require('express');
const connection = require('../connection');
const { restart } = require('nodemon');
const router = express.Router();
const axios = require('axios');


const bcrypt = require("bcrypt");




const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let auth = require('../services/authentication');
let checkRole = require('../services/checkrole')

require('dotenv').config();
//correctly ... 
let transport = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


// Function to generate a reset token
function generateResetToken() {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}
router.post('/verified', (req, res) => {
  // Access the data sent in the request body
  const { name, email } = req.body;
  console.log(name, email);
  
  const resetToken = generateResetToken();
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verification Email',
    html: `<p><b>Dear ${name},</b><br> This link is sent by the embassy of Islami Emirate of Afghanistan , please click on the link to complete your signup process:<br><a href="http://localhost:4200/signup?email=${email}">${email}</a></p>`
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return res.status(200).json({ message: "Error sending the email" });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: "Verification email sent successfully" });
    }
  });
});




router.post('/signup', async (req, res) => {
  const user = req.body;
  const reCaptchaToken = user.recaptchaReactive;
  console.log(user)
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: '6LdjgL0mAAAAAINtaezGiNAJpqJnt9GN_lLcX-dJ',
        response: reCaptchaToken
      }
    });

    if (response.data.success && !response.data['error-codes']) {
      // reCAPTCHA verification succeeded and there are no error codes
      // Proceed with user registration logic
      const email = user.email;
      const password = user.password;
      const confirmPassword = user.confirmPassword;
      //in this case we assign the actual value to the email , password and confirmPassword

      // Check if the password and confirmPassword match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Check if the email already exists
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = "SELECT email, password, role, status FROM user WHERE email = ?";
      connection.query(query, [email], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error occurred while querying data", error: err });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: "Email already exists" });
        }

        // Insert the user into the database
        const insertQuery = "INSERT INTO user (email, password, status, role) VALUES (?, ?, 'false', 'user')";
        connection.query(insertQuery, [email,  hashedPassword], (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Error occurred while saving data", error: err });
          }

          return res.status(200).json({ message: "Successfully registered" });
        });
      });
    } else {
      // reCAPTCHA verification failed
      console.log('reCAPTCHA verification failed');
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({ message: 'Error occurred during reCAPTCHA verification' });
  }
});



router.post('/login', (req, res) => {
  let { email, password } = req.body;
  console.log(req.body)
  const query = "SELECT id, email, password, role FROM user WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (!err) {
      console.log(results)
      if (results.length <= 0) {
        return res.status(401).json({ message: "Incorrect email or password" });
      }

      const userId = results[0].id;
      console.log("User ID:", userId);
      const hashedPassword = results[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect email or password" });
      } else {
        const response = { email: results[0].email, role: results[0].role, id: userId };
        const accessToken = jwt.sign(response, process.env.Access_Token, { expiresIn: '30d' });
        return res.status(200).json({ message: "Login successful", token: accessToken, userId: userId });
      }
    } else {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});







// correctly...


// Define the router
router.post('/forgotPassword', auth.authenticateToken, (req, res) => {
  const { email } = req.body;
  const query = "SELECT email, password FROM user WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        console.log("User does not exist with this email:", email);
        return res.status(200).json({ message: "User does not exist with this email" });
      } else {
        const resetToken = generateResetToken();
        let mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: 'Reset Password',
          html: `<p><b>Your login details:</b><br><b>Email:</b> ${results[0].email}<br> <a href="http://localhost:4200/forget-password?token=${resetToken}&email=${results[0].email}"> This email is sent by <strong>The Embassy of Islamic Emirate of Afghanistan</strong> please click on the email to reset your password</a></p>`
        };

        transport.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log("Error sending the email:", err);
            return res.status(200).json({ message: "Error sending the email" });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: "Password reset email sent successfully" });
          }
        });
      }
    } else {
      console.error("Server error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });
});



router.put('/resetPassword/:email', auth.authenticateToken, (req, res) => {
  const email = req.params.email;
  const newPassword = req.body.password;

  console.log("this is the email:", email);
  console.log("this is the new password:", newPassword);

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.send({ status: false, message: "Password update failed" });
    } else {
      let sql = "UPDATE user SET password=? WHERE email=?";
      let values = [hashedPassword, email];

      connection.query(sql, values, (error, result) => {
        if (error) {
          console.error("Error updating password:", error);
          res.send({ status: false, message: "Password update failed" });
        } else {
          console.log("Password updated successfully");
          res.send({ status: true, message: "Password updated successfully" });
        }
      });
    }
  });
});


router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const page = parseInt(req.query.page);
  console.log('this is the page ',page)
  const perPage = parseInt(req.query.perPage)
  console.log("this is the per page value ",perPage)

  const offset = (page - 1) * perPage;

  let query = `
    SELECT user.id, user.email, category.*, files.*
    FROM user
    INNER JOIN category ON category.userId = user.id
    INNER JOIN files ON files.categoryId = category.categoryId
    GROUP BY category.categoryId, files.categoryId
  
    LIMIT ${perPage}
    OFFSET ${offset}
  `;

  console.log('Query:', query); 

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error in SQL query:', err); 
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const totalRecordsQuery = `
      SELECT COUNT(*) AS totalCount
      FROM user
      INNER JOIN category ON category.userId = user.id
      INNER JOIN files ON files.categoryId = category.categoryId
    `;

    console.log('Total Records Query:', totalRecordsQuery); 

    connection.query(totalRecordsQuery, (err, countResult) => {
      if (err) {
        console.error('Error in Total Records Query:', err); 
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const totalCount = countResult[0].totalCount || 0;

      console.log('Total Count:', totalCount); 

      const response = {
        data: results,
        page: page,
        perPage: perPage,
        totalCount: totalCount,
      };

      console.log('Response:', response); 

      return res.status(200).json(response);
    });
  });
});


router.get('/searchIdofidthird/:id', auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  console.log("this is id of us", id);
  let query = "SELECT categoryId, cnic, name , fatherFulName  FROM category WHERE categoryId = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      console.log("Query results:", results);
      return res.status(200).json(results);
    } else {
      console.error("Query error:", err); 
      return res.status(500).json(err);
    }
  });
});














module.exports = router;
