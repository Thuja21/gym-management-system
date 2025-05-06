import { db } from "../config/connectDatabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

          // Insert into gym_members table
          const memberInsertQuery =
              "INSERT INTO gym_members (`user_id`, `age`, `gender`, `dob`, `status`, `registered_date`, `height`, `weight`, `blood_group`, `current_fitness_level`, `fitness_goal`, `health_issues`, `plan_id`) VALUES (?)";
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
            req.body.plan_id
          ];

          db.query(memberInsertQuery, [memberValues], (err, memberResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json(err);
              });
            }

            const memberId = memberResult.insertId;

            // Generate payment ID
            const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

                // Return payment details for invoice generation
                return res.status(200).json({
                  message: "User has been created successfully",
                  paymentDetails: {
                    payment_id: paymentId,
                    payment_date: paymentValues[4], // Fixed index (was 3)
                    amount: paymentValues[3],        // Fixed index (was 4)
                    plan_id: req.body.plan_id
                  }
                });
              });
            });
          });
        } else if (user_type === "CUSTOMER") {
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
  const q = "SELECT * FROM users WHERE user_name = ?";
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
      query = "SELECT member_id FROM gym_members WHERE user_id = ?";
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
            maxAge: 60 * 60 * 1000,
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
          "secretkey"
      );

      const { password, ...others } = user;
      res
          .cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 1000,
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


