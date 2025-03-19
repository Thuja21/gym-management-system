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
    console.log("User Type::::::::::::::::", user_type);

    // Start transaction
    db.beginTransaction((err) => {
      if (err) return res.status(500).json(err);

      // Insert into users table
      const userInsertQuery =
        "INSERT INTO users (`user_name`,`full_name`,`password`, `email`,  `contact_no`, `user_type` , `address` ) VALUES (?)";
      const userValues = [
        req.body.username,
        req.body.fullname,
        hashedPassword,
        req.body.email,
        req.body.contactNo,
        user_type,
        req.body.address,
      ];

      db.query(userInsertQuery, [userValues], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json(err);
          });
        }

        var subTableInsertQuery;
        var subTableValues;

        console.log(result);

        if (user_type === "MEMBER") {
          subTableInsertQuery =
            "INSERT INTO gym_members (`user_id`, `age`, `gender`, `dob`, `status`,`registered_date`, `height`, `weight`, `blood_group`, `current_fitness_level`, `fitness_goal`, `health_issues`, `plan_id`) VALUES (?)";
          subTableValues = [result.insertId, req.body.age, req.body.gender, req.body.dob, 1, new Date(), req.body.height, req.body.weight, req.body.bloodGroup, req.body.currentFitnessLevel, req.body.fitnessGoal, req.body.healthIssues, req.body.plan_id];
        } else if (user_type === "CUSTOMER") {
          subTableInsertQuery =
            "INSERT INTO customers (`user_id`) VALUES (?)";
          subTableValues = [
            result.insertId
          ];
        }

        db.query(subTableInsertQuery, [subTableValues], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }

          // Commit the transaction if both queries succeed
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json(err);
              });
            }

            // Send success response
            res.status(200).json("User has been created.");
          });
        });
      });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE user_name = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
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


export const totalRegistration = (req, res) => {
  const query = `
    SELECT COUNT(*) AS total_registrations
    FROM gym_members
    WHERE MONTH(registered_date) = MONTH(CURRENT_DATE)
      AND YEAR(registered_date) = YEAR(CURRENT_DATE)
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Error fetching total registrations" });
    }

    // If results exist, send the count; otherwise, send 0
    res.status(200).json({ total_registrations: results[0].total_registrations || 0 });
  });
};

