import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getNotes, createNote, updateNote, deleteNote as deleteNoteApi } from "../services/api";
import "./dashboard.css"

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [sortBy, setSortBy] = useState("default");

    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            //Api call to fetch notes
            const response = await getNotes(token);

            setNotes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() && !content.trim()) {
            toast.warning("Title or note required");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (editingNoteId) {
                //Api call to update note
                await updateNote(editingNoteId, { title, content }, token);
                toast.success("Note updated successfully!", { autoClose: 1000 })
            } else {
                //Api call to create note
                await createNote({ title, content }, token);
                toast.success("Note created successfully!", { autoClose: 1000 });
            }

            setTitle("");
            setContent("");
            setEditingNoteId(null);

            fetchNotes();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const deleteNote = async (id) => {
        const confirmed = window.confirm(
            "Delete this note?"
        );
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            //Api call to delete note
            await deleteNoteApi(id, token);
            toast.success("Note deleted successfully!", { autoClose: 1000 })

            fetchNotes();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedNotes = [...filteredNotes];
    if (sortBy === "newest") {
        sortedNotes.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
    }
    if (sortBy === "oldest") {
        sortedNotes.sort(
            (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
        );
    }
    if (sortBy === "az") {
        sortedNotes.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }
    if (sortBy === "za") {
        sortedNotes.sort((a, b) =>
            b.title.localeCompare(a.title)
        );
    }

    const handleLogout = () => {
        if (isLoggingOut) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.info("LoggedOut", { autoClose: 1000 })
            navigate("/login");
        } else {
            setIsLoggingOut(true);
        }
    }

    return (
        <div className="dashboard">
            <div className="d1">
                <button className="buttons logoutButton" onClick={handleLogout}>{isLoggingOut ? "Confirm Logout" : "Logout"}</button>
                {isLoggingOut && <button className="buttons cancel" onClick={() => setIsLoggingOut(false)}>Cancel</button>}
                <button className="accDelButton buttons" onClick={() => navigate("/delete-account")}>Delete Account</button>
            </div>
            <div className="d2">
                <p id="greet">Hi {user.name || "there"},</p>
                <h1>Create Notes</h1>
                <form className="notesInputContainer" onSubmit={handleSubmit}>
                    <div className="subNotesInputContainer">
                        <h3>Title</h3>
                        <input type="text" placeholder="Notes title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="subNotesInputContainer">
                        <h3>Note</h3>
                        <textarea placeholder="I'm .." value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    <div>
                        <button className="buttons submitButton" type="submit">
                            {editingNoteId ? "Update Note" : "Create Note"}
                        </button>
                        {editingNoteId && <button className="buttons cancel" type="button" onClick={() => {
                            setEditingNoteId(null);
                            setTitle("");
                            setContent("");
                        }}>Cancel</button>}
                    </div>
                </form>
            </div>
            <div className="d3">
                <h1>My Notes</h1>
                <input id="searchBar" type="text" placeholder="🔍 Search notes..." disabled={!notes.length} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="sortSelection">
                    <p>Sort: </p>
                    <select disabled={!notes.length} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="default">Recent Created</option>
                        <option value="newest">Last Modified (Newest)</option>
                        <option value="oldest">Last Modified (Oldest)</option>
                        <option value="az">A → Z</option>
                        <option value="za">Z → A</option>
                    </select>
                </div>
                <div className="notesList">
                    {filteredNotes.length > 0 ? sortedNotes.map(note => (
                        <div key={note.id}>
                            <h3><span id="notesSerial">#{note.id}.</span> {note.title}</h3>
                            <p className="notesContent">{note.content}</p>
                            <button className="buttons edit" onClick={() => {
                                setEditingNoteId(note.id);
                                setTitle(note.title);
                                setContent(note.content);
                            }}>Edit</button>
                            <button className="buttons delButton" disabled={editingNoteId === note.id} onClick={() => deleteNote(note.id)}>Delete</button>
                            <p className="noteDate">{note.updated_at !== note.created_at ? "Updated" : "Created"}: {new Date(note.updated_at).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit"
                            })}</p>
                        </div>
                    )) : <>
                        <h3>No notes found</h3>
                        <p>Create your first note!</p>
                    </>}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;