const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const noteRoutes = require('./routes/noteRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});