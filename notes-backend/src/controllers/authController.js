const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists, please login",
            });
        }

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Registration failed",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Login failed",
        });
    }
};

const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `DELETE FROM users
            WHERE id = $1
            RETURNING *`,
            [userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        res.status(200).json({
            message: "Account and data deletion successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Account deletion failed"
        })
    }
};

module.exports = {
    registerUser,
    loginUser,
    deleteUserAccount
};
