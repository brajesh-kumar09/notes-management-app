const express = require('express');
const { createNote, getAllNotes, getSingleNote, updateNote, deleteNote } = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getAllNotes);
router.get("/:id", authMiddleware, getSingleNote);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

module.exports = router;