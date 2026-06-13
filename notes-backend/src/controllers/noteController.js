const pool = require('../db');

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.userId;

        if (!title?.trim() && !content?.trim()) {
            return res.status(400).json({
                message: "Title or note is required",
            });
        }

        const result = await pool.query(
            `INSERT INTO notes (title, content, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [title, content, userId]
        );

        res.status(201).json({
            message: "Note created successfully",
            note: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create note",
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT * FROM notes
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch notes",
        });
    }
};

const getSingleNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT *
            FROM notes
            WHERE id = $1 AND user_id = $2`,
            [noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch note",
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.userId;

        const { title, content } = req.body;

        if (!title?.trim() && !content?.trim()) {
            return res.status(400).json({
                message: "Title or note required",
            });
        }

        const result = await pool.query(
            `UPDATE notes
            SET title = $1,
                content = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            AND user_id = $4
            RETURNING *`,
            [title, content, noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.status(200).json({
            message: "Note updated successfully",
            note: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update note",
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.userId;

        const result = await pool.query(
            `DELETE FROM notes
            WHERE id = $1
            AND user_id = $2
            RETURNING *`,
            [noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete note",
        });
    }
};

module.exports = {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
};