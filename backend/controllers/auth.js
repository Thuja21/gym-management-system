import { db } from "../config/connectDatabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto"; // For generating reset token
import dotenv from "dotenv";
dotenv.config();

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP server
  port: 465,
  secure: true, // Use TLS (STARTTLS) for port 587
  auth: {
    user: 'jkfitnessppt@gmail.com', // Hardcoded email address
    pass: 'cyhubhjxgfjmsabs', // Replace with your actual password or App Password
  },
  timeout: 60000, // Increased timeout to 60 seconds to handle slow connections
});

// Function to generate a 6-digit code
const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number between 100000 and 999999
};

export const register = (req, res) => {
  // Check if user already exists
  const q = "SELECT * FROM users WHERE user_name = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user_type = req.body.userType;

    // Start transaction
    db.beginTransaction((err) => {
      if (err) return res.status(500).json(err);

      // Insert into users table
      const userInsertQuery =
          "INSERT INTO users (`user_name`,`full_name`,`password`, `email`, `contact_no`, `user_type`, `address`) VALUES (?)";
      const userValues = [
        req.body.username,
        req.body.fullname,
        hashedPassword,
        req.body.email,
        req.body.contactNo,
        user_type,
        req.body.address,
      ];

      db.query(userInsertQuery, [userValues], (err, userResult) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json(err);
          });
        }

        const userId = userResult.insertId;

        // Handle MEMBER-specific data
        if (user_type === "MEMBER") {
          // Calculate due date (30 days from now)
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);

          // Get the current date for start_date
          const startDate = new Date();
          console.log("Start date:", startDate);

          // Fetch plan details to determine duration
          db.query(
              "SELECT plan_name FROM plans WHERE plan_id = ?",
              [req.body.plan_id],
              (err, planDetails) => {
                if (err) {
                  console.error("Error fetching plan details:", err);
                  return db.rollback(() => {
                    res.status(500).json(err);
                  });
                }

                console.log("Plan details from DB:", planDetails);

                // Initialize end date
                let endDate = new Date();

                if (planDetails && planDetails.length > 0) {
                  const plan_name = planDetails[0].plan_name.toLowerCase();
                  console.log("Plan name (lowercase):", plan_name);

                  // Calculate end date differently based on plan
                  if (plan_name.includes('monthly')) {
                    // Add exactly 30 days for monthly plan
                    endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                    console.log("Monthly plan - End date:", endDate);
                  } else if (plan_name.includes('quarterly')) {
                    // Add exactly 90 days for quarterly plan
                    endDate = new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000));
                    console.log("Quarterly plan - End date:", endDate);
                  } else if (plan_name.includes('yearly') || plan_name.includes('annual')) {
                    // Add exactly 365 days for yearly plan
                    endDate = new Date(startDate.getTime() + (365 * 24 * 60 * 60 * 1000));
                    console.log("Yearly plan - End date:", endDate);
                  } else {
                    // Default to 30 days if plan type is unknown
                    endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                    console.log("Unknown plan type, defaulting to 30 days - End date:", endDate);
                  }
                } else {
                  console.log("No plan details found, defaulting end date to 30 days from start");
                  // Default to 30 days if no plan details found
                  endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                }

                console.log("Final end date to be inserted:", endDate);

                // Insert into gym_members table
                const memberInsertQuery =
                    "INSERT INTO gym_members (`user_id`, `age`, `gender`, `dob`, `status`, `registered_date`, `height`, `weight`, `blood_group`, `current_fitness_level`, `fitness_goal`, `health_issues`, `plan_id`, `start_date`, `end_date`) VALUES (?)";
                const memberValues = [
                  userId,
                  req.body.age,
                  req.body.gender,
                  req.body.dob,
                  1, // status (1 for active)
                  new Date(),
                  req.body.height,
                  req.body.weight,
                  req.body.bloodGroup,
                  req.body.currentFitnessLevel,
                  req.body.fitnessGoal,
                  req.body.healthIssues,
                  req.body.plan_id,
                  startDate,
                  endDate
                ];

                console.log("Member values to be inserted:", memberValues);

                db.query(memberInsertQuery, [memberValues], (err, memberResult) => {
                  if (err) {
                    console.error("Error inserting member data:", err);
                    return db.rollback(() => {
                      res.status(500).json(err);
                    });
                  }

                  const memberId = memberResult.insertId;
                  console.log("Member inserted with ID:", memberId);

                  // Generate payment ID
                  // const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                  const paymentId = 'PAY-' + Math.random().toString(36).slice(2, 8).toUpperCase();

                  // Insert payment record
                  const paymentQuery =
                      "INSERT INTO plan_payments (`payment_id`, `member_id`, `plan_id`, `amount`, `payment_date`, `due_date`, `status`, `payment_method`) VALUES (?)";
                  const paymentValues = [
                    paymentId,
                    memberId,
                    req.body.plan_id,
                    parseFloat(req.body.payment_details?.amount || 0),
                    new Date(), // payment_date
                    dueDate, // due_date
                    1, // status (1 for paid)
                    req.body.payment_details?.payment_method || "Credit Card"
                  ];

                  db.query(paymentQuery, [paymentValues], (err, paymentResult) => {
                    if (err) {
                      console.error("Error inserting payment data:", err);
                      return db.rollback(() => {
                        res.status(500).json(err);
                      });
                    }

                    // Commit transaction
                    db.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        return db.rollback(() => {
                          res.status(500).json(err);
                        });
                      }

                      console.log("Transaction committed successfully");
                      // Return payment details for invoice generation
                      return res.status(200).json({
                        message: "User has been created successfully",
                        paymentDetails: {
                          payment_id: paymentId,
                          payment_date: paymentValues[4],
                          amount: paymentValues[3],
                          plan_id: req.body.plan_id
                        }
                      });
                    });
                  });
                });
              }
          );
      }else if (user_type === "CUSTOMER") {
          // Handle CUSTOMER-specific data
          const customerInsertQuery = "INSERT INTO customers (`user_id`) VALUES (?)";

          db.query(customerInsertQuery, [userId], (err, customerResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json(err);
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json(err);
                });
              }

              return res.status(200).json("Customer has been created successfully");
            });
          });
        } else {
          // Commit transaction for other user types (if any)
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json(err);
              });
            }
            return res.status(200).json("User has been created successfully");
          });
        }
      });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE user_name = ? AND is_deleted = 0";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPassword) return res.status(400).json("Wrong password or username!");

    const user = data[0];
    const userId = user.id;

    // Fetch role
    const role = user.user_type;

    let query = "";
    let idKey = "";

    if (role === "MEMBER") {
      query = "SELECT member_id FROM gym_members WHERE user_id = ? AND is_deleted = 0";
      idKey = "member_id";
    } else if (role === "TRAINER") {
      query = "SELECT trainer_id FROM trainers WHERE user_id = ?";
      idKey = "trainer_id";
    } else if (role === "ADMIN") {
      // No extra table, just use the user ID
      const token = jwt.sign({ id: userId, role }, "secretkey");
      const { password, ...others } = user;
      return res
          .cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({ ...others, role });
    } else {
      return res.status(400).json("Invalid role!");
    }

    // Query for member or trainer
    db.query(query, [userId], (err2, roleData) => {
      if (err2) return res.status(500).json(err2);
      if (roleData.length === 0) return res.status(404).json(`${role} not found!`);

      const token = jwt.sign(
          { id: userId, [idKey]: roleData[0][idKey], role },
          "secretkey",
      { expiresIn: "24h" } // Changed from default 1h to 24h
      );

      const { password, ...others } = user;
      res
          .cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({ ...others, [idKey]: roleData[0][idKey], role });
    });
  });
};


export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};

// Forgot Password Handler (Callback-based)
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Check if user exists using callback
  db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, rows) => {
        if (err) {
          console.error('Error in forgot password (query):', err);
          return res.status(500).json({ error: 'Internal server error. Please try again' });
        }

        if (rows.length === 0) {
          return res.status(404).json({ error: 'No user found with this email' });
        }

        // Generate reset token
        const resetCode = generateSixDigitCode(); // 6-digit code for email
        const resetCodeExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

        // Save token and expiry to user record using callback
        db.query(
            'UPDATE users SET reset_code= ?, reset_code_expiry = ? WHERE email = ?',
            [resetCode, resetCodeExpiry, email],
            (updateErr) => {
              if (updateErr) {
                console.error('Error in forgot password (update):', updateErr);
                return res.status(500).json({ error: 'Internal server error. Please try again' });
              }

              // Create reset URL
              const resetUrl = `${'http://localhost:5173 || http://localhost:5174'}/reset-password?token=${resetCode}`;

              // Email content
              const mailOptions = {
                from: 'jkfitnessppt@gmail.com',
                to: email,
                subject: 'Password Reset Request',
                text: `You requested a password reset. Use the following token to reset your password:\n\nCode: ${resetCode}\n\nAlternatively, click the link below:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
                html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><strong>Code: ${resetCode}</strong></p><p>Alternatively, click the link below:</p><p><a href="${resetUrl}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`,
              };

              // Send email (nodemailer supports callbacks)
              transporter.sendMail(mailOptions, (mailErr, info) => {
                if (mailErr) {
                  console.error('Error sending email:', mailErr);
                  return res.status(500).json({ error: 'Internal server error. Please try again' });
                }

                res.status(200).json({ message: 'Password reset email sent successfully' });
              });
            }
        );
      }
  );
};

// Verify Reset Code Controller
export const verifyCode = (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required' });
    }

    // Check if the code matches and hasn't expired using callback
    db.query(
        'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expiry > NOW()',
        [email, code],
        (error, rows) => {
          if (error) {
            console.error('Error verifying reset code:', error);
            return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
          }

          if (rows.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid or expired code' });
          }

          res.status(200).json({ success: true, message: 'Code verified successfully', code: rows[0].reset_code });
        }
    );
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
};

// Reset Password Controller with Hashing and Length Validation
export const resetPassword = (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, code, and new password are required' });
    }

    // Validate password length (minimum 6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    // Check if the token is valid and hasn't expired using callback
    db.query(
        'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expiry > NOW()',
        [email, code],
        (error, rows) => {
          if (error) {
            console.error('Error checking reset code:', error);
            return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
          }

          if (rows.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid or expired code' });
          }

          // Hash the new password before storing
          bcrypt.hash(newPassword, 10, (hashError, hashedPassword) => {
            if (hashError) {
              console.error('Error hashing password:', hashError);
              return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
            }

            // Update the password using callback
            db.query(
                'UPDATE users SET password = ?, reset_code = NULL, reset_code_expiry = NULL WHERE email = ?',
                [hashedPassword, email],
                (updateError) => {
                  if (updateError) {
                    console.error('Error updating password:', updateError);
                    return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
                  }

                  console.log('Password updated successfully for email:', email);
                  res.status(200).json({ success: true, message: 'Password updated successfully' });
                }
            );
          });
        }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
};